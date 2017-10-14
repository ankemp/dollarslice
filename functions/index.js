const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision')();
const Yelp = require('yelp-api-v3'); // https://github.com/kristenlk/yelp-api-v3
const _ = require('lodash');
const math = require('mathjs');
firebaseAdmin.initializeApp(functions.config().firebase)

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds.

const yelpCreds = {
  app_id: functions.config().yelp.app_id,
  app_secret: functions.config().yelp.app
};

exports.ocrProcessListener = functions.storage.object()
  .onChange(event => {
    const object = event.data;
    // Exit if this is a move or deletion event.
    if (object.resourceState === 'not_exists') {
      return console.log('This is a deletion event.');
    }

    if (!_.startsWith(object.name, 'serial/')) {
      return console.log('Not in the serial/ folder');
    }

    const gcsImageUri = `gs://${object.bucket}/${object.name}`;
    const image = { source: { gcsImageUri } };

    const sdb = firebaseAdmin.firestore();
    const serialCol = sdb.collection('serial');

    const db = firebaseAdmin.database();
    const key = _.last(_.split(object.name, '/'));
    const itemRef = db.ref(`scan-queue/${key}`);
    const statusRef = itemRef.child('status');

    return statusRef.set('ocr_processing')
      .then(() => vision.textDetection(image))
      .then(data => {
        statusRef.set('finding_serial');
        return lookForSerial(data);
      })
      .then(serial => {
        statusRef.set('saving_serial');
        const docRef = serialCol.doc(serial);
        docRef.get().then(doc => {
          if (!doc.exists) {
            docRef.set({ serial, image: object.name, timestamp: Date.now() });
          }
        });
        return serial;
      })
      .then(serial => {
        itemRef.update({ serial });
        return statusRef.set('finalizing');
      })
      .then(() => statusRef.set('complete'))
      .catch(err => {
        console.log(err);
        if (!_.isUndefined(err.code) && err.message === 'error_no_serial') {
          // Delete bad image here
        }
        if (!_.isUndefined(err.code) && err.code === 204) {
          return statusRef.set(err.message);
        }
        return statusRef.set('server_error');
      });
  });

function lookForSerial(data) {
  return new Promise((Resolve, Reject) => {
    if (_.isArray(data)) {
      let text = data[0].textAnnotations;
      if (!_.isUndefined(text) && _.isArray(text) && text.length !== 0) {
        text = text[0].description;
      }
      const textItems = _.split(text, '\n');
      if (textItems.length) {
        let matched = _.filter(textItems, text => {
          /**
           * Look for serial in textItems
           * Can match:
           * A 01234567 B
           * A01234567B
           */
          return (/\b[A-Z]{1}\d{8}[A-Z]{1}\b|\b[A-Z]{1} \d{8} [A-Z]{1}\b/.test(text));
        });
        if (matched.length) {
          // Take last item
          matched = _.last(matched);
          // Standardize serial numbers (no whitespace)
          matched = _.replace(matched, /\s/g, '')
          return Resolve(matched);
        }
        return Reject({ code: 204, message: 'error_no_serial' });
      }
    }
    return Reject({ code: 204, message: 'error_no_text' });
  });
}

exports.yelpSearch = functions.database.ref('/yelp-search/{queryid}')
  .onCreate(event => {
    const { queryid } = event.params;
    const searchRef = event.data.ref;
    const yelp = new Yelp(yelpCreds);

    const params = {
      term: 'pizza',
      price: '1,2',
      limit: 5,
      open_now: true,
      sort_by: 'distance',
      latitude: event.data.val().latitude,
      longitude: event.data.val().longitude
    };
    searchRef.update({ status: 'searching' });
    return yelp.search(params)
      .then(data => {
        searchRef.update({ status: 'parsing' });
        let results = JSON.parse(data);
        results = results.businesses;
        results = _.map(results, business => {
          business = _.omit(business, ['transactions', 'categories', 'review_count', 'url']);
          let distance = math.unit(business.distance, 'meter').toNumber('feet');
          business.distance_unit = 'feet';
          if (parseInt(distance) >= 1320) {
            distance = math.unit(distance, 'ft').toNumber('mile');
            business.distance_unit = 'mi';
          }
          business.direction = getDirection({ longitude: params.longitude, latitude: params.latitude }, business.coordinates);
          business.distance = distance;
          return business;
        });
        return searchRef.update({ status: 'complete', results });
      })
      .catch(err => {
        return searchRef.update({ status: 'error' });
        console.error(err);
      })
  });

function getDirection(p1, p2) {
  const latitude = math.subtract(p2.latitude, p1.latitude);

  const y = math.sin(latitude) * math.cos(p2.latitude);
  const x = math.cos(p1.latitude) * math.sin(p1.latitude) - math.sin(p1.latitude) * math.cos(p1.latitude) * math.cos(latitude);

  const brng = math.atan2(y, x) * 180 / math.pi;
  return 360 - ((brng + 360) % 360);

}

function cleanRTDBChildren(event) {
  const ref = event.data.ref.parent;
  const now = Date.now();
  const cutoff = now - CUT_OFF_TIME;
  const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
  return oldItemsQuery.once('value').then(snapshot => {
    const updates = _.reduce(snapshot, (result, child) => {
      result[child.key] = null;
      return result;
    }, {});
    return ref.update(updates);
  });
}

exports.cleanOldSearches = functions.database.ref('/yelp-search/{pushId}').onCreate(cleanRTDBChildren);
exports.cleanOldScans = functions.database.ref('/scan-queue/{pushId}').onCreate(cleanRTDBChildren);
