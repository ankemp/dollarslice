const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision')();
firebaseAdmin.initializeApp(functions.config().firebase)

exports.ocrProcessListener = functions.storage.object()
  .onChange(event => {
    const object = event.data;
    // Exit if this is a move or deletion event.
    if (object.resourceState === 'not_exists') {
      return console.log('This is a deletion event.');
    }

    if (!object.name.startsWith('images/')) {
      return console.log('Not in the images/ folder');
    }

    const gcsImageUri = `gs://${object.bucket}/${object.name}`;
    var image = { source: { gcsImageUri } };
    const db = firebaseAdmin.database();
    const itemRef = db.ref(object.name);
    const statusRef = itemRef.child('status');

    return statusRef.set('ocr_processing')
      .then(() => vision.textDetection(image))
      .then(data => {
        statusRef.set('finding_serial');
        return lookForSerial(data);
      })
      .then(serial => {
        statusRef.set('finalizing');
        return itemRef.child('serial').set(serial);
      })
      .then(() => statusRef.set('complete'))
      .catch(err => {
        console.log(err);
        if (typeof err.code !== 'undefined' && err.code === 204) {
          return statusRef.set(err.message);
        }
        return statusRef.set('error');
      });
  });

function lookForSerial(data) {
  return new Promise((Resolve, Reject) => {
    if (Array.isArray(data)) {
      let text = data[0].textAnnotations;
      console.log(text);
      if (typeof text !== 'undefined' && Array.isArray(text) && text.length !== 0) {
        text = text[0].description;
      }
      const textItems = text.split('\n');
      if (textItems.length) {
        let matched = textItems.filter(text => {
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
          matched = matched.pop();
          // Standardize serial numbers (no whitespace)
          matched = matched.replace(' ', '');
          return Resolve(matched);
        }
        return Reject({ code: 204, message: 'error_no_serial' });
      }
    }
    return Reject({ code: 204, message: 'error_no_text' });
  });
}
