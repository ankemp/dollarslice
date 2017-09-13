import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
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

  private getQuick(): Promise<Coordinates | PositionError> {
    return new Promise((Resolve, Reject) => {
      this._navigator.geolocation
        .getCurrentPosition(position => {
          return Resolve(position.coords);
        }, err => {
          return Reject(err);
        });
    });
  }

  private getAccurate(): Promise<Coordinates | PositionError> {
    const options = <PositionOptions>{
      enableHighAccuracy: true,
    };
    return new Promise((Resolve, Reject) => {
      this._navigator.geolocation
        .getCurrentPosition(position => {
          return Resolve(position.coords);
        }, err => {
          return Reject(err);
        }, options);
    });
  }

  getLocation(highAccuracy = false): Promise<Coordinates | PositionError> {
    let position;
    if (highAccuracy) {
      position = this.getAccurate();
    } else {
      position = this.getQuick();
    }
    position.then(coords => {
      this.coords.next(coords);
    });
    return position;
  }

  create(location: any): Promise<string | Error> {
    return new Promise((Resolve, Reject) => {
      const { distance, distance_unit, is_closed, id, ...data } = location;
      this.db.object(`location/${id}`)
        .set({ ...data })
        .then(_ => Resolve(id))
        .catch(Reject);
    });
  }

  private checkInList(): FirebaseListObservable<any[]> {
    return this.db.list('check-in');
  }

  checkIn(): firebase.database.ThenableReference {
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
    return this.checkInList()
      .push({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userKey,
        locationKey,
        serialKey,
      });
  }

}
