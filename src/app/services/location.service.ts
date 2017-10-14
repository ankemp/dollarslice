import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';

import { NavigatorRefService } from './navigator-ref.service';
import { UserService } from './user.service';
import { SerialService } from './serial.service';

@Injectable()
export class LocationService {
  private _navigator: Navigator;
  public coords = new BehaviorSubject<Coordinates>(null);
  public locationKey = new BehaviorSubject<string>(null);

  constructor(
    private db: AngularFireDatabase,
    private sdb: AngularFirestore,
    private navigatorService: NavigatorRefService,
    private user: UserService,
    private serial: SerialService
  ) {
    this._navigator = navigatorService.nativeNavigator;
    if ('geolocation' in this._navigator) {
      console.log('geoLocation ready');
    } else {
      alert('Browser not supported');
    }
  }

  getLocation(enableHighAccuracy = false): Promise<Coordinates | PositionError> {
    return new Promise((Resolve, Reject) => {
      this._navigator.geolocation
        .getCurrentPosition(({ coords }) => {
          this.coords.next(coords);
          Resolve(coords);
        }, err => {
          Reject(err);
        }, <PositionOptions>{ enableHighAccuracy });
    });
  }

  private get locationCollection(): AngularFirestoreCollection<any> {
    return this.sdb.collection('location');
  }

  lookup(id: string): AngularFirestoreDocument<any> {
    this.locationKey.next(id);
    return this.locationCollection.doc(id);
  }

  create(location: any): Promise<string | Error> {
    return new Promise((Resolve, Reject) => {
      const { distance, distance_unit, is_closed, id, ...data } = location;
      this.lookup(id).set({ ...data, timestamp: firebase.firestore.FieldValue.serverTimestamp })
        .then(_ => Resolve(id))
        .catch(Reject);
    });
  }

  findOrCreate(location: any): Promise<string | Error> {
    return new Promise((Resolve, Reject) => {
      const { id } = location;
      const docRef = this.lookup(id);
      docRef.ref.get()
        .then(({ exists }) => exists ? null : this.create(location))
        .then(_ => Resolve(id))
        .catch(err => Reject(err));
    });
  }

  private get checkInList(): AngularFirestoreCollection<any> {
    return this.sdb.collection('check-in');
  }

  checkIn(): Promise<firebase.firestore.DocumentReference> {
    const userKey = this.user.userKey.getValue();
    const serialKey = this.serial.serialKey.getValue();
    const locationKey = this.locationKey.getValue();
    /**
     * This pushes a new entry check-in table.
     * Cloud functions will have the duty of creating these relationships:
     * user -> check-ins
     * user -> locations
     * user -> serials
     * location -> users
     * location -> serials
     * serial -> users
     * serial -> locations
     */
    return this.checkInList.add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp,
      userKey,
      locationKey,
      serialKey,
    });
  }

}
