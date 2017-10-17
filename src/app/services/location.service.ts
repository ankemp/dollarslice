import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { NavigatorRefService } from './navigator-ref.service';
import { UserService } from './user.service';
import { SerialService } from './serial.service';

@Injectable()
export class LocationService {
  private _navigator: Navigator;
  private activeRef: AngularFirestoreDocument<any>;
  public active: Observable<any>;
  public coords = new BehaviorSubject<Coordinates>(null);
  public locationKey = new BehaviorSubject<string>(null);

  constructor(
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

  lookup(id = this.locationKey.getValue()): AngularFirestoreDocument<any> {
    const currentID = this.locationKey.getValue();
    if (id !== currentID) {
      this.activeRef = this.locationCollection.doc(id);
      this.active = this.activeRef.valueChanges();
      this.locationKey.next(id);
    }
    return this.activeRef;
  }

  create(location: any): Promise<string | Error> {
    return new Promise((Resolve, Reject) => {
      const { distance, distance_unit, is_closed, id, ...data } = location;
      this.lookup(id).set({ ...data, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
        .then(_ => Resolve(id))
        .catch(Reject);
    });
  }

  findOrCreate(location: any): Promise<string | Error> {
    return new Promise((Resolve, Reject) => {
      const { id } = location;
      const docRef = this.lookup(id);
      docRef.ref.get()
        .then(({ exists }) => !exists ? this.create(location) : null)
        .then(_ => Resolve(id))
        .catch(err => Reject(err));
    });
  }

}
