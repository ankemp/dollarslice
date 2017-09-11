import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

import { NavigatorRefService } from './navigator-ref.service';

@Injectable()
export class LocationService {
  private _navigator: Navigator;
  public active: FirebaseObjectObservable<any>;

  constructor(
    public db: AngularFireDatabase,
    private navigatorService: NavigatorRefService,
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
    if (highAccuracy) {
      return this.getAccurate();
    } else {
      return this.getQuick();
    }
  }

  private yelpList(): FirebaseListObservable<any[]> {
    return this.db.list('yelp-search');
  }

  private createSearch({ longitude, latitude }: { longitude: number, latitude: number }): firebase.database.ThenableReference {
    return this.yelpList()
      .push({
        status: 'query',
        latitude,
        longitude,
        created: firebase.database.ServerValue.TIMESTAMP
      });
  }

  lookupYelp(key: string): void {
    this.active = this.db.object(`yelp-search/${key}`);
  }

  searchYelp(coords: Coordinates): firebase.database.ThenableReference {
    const thenable = this.createSearch(coords);
    thenable.then(({ key }) => {
      this.lookupYelp(key);
    });
    return thenable;
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

  checkin(serialKey: string, locationKey: string): Promise<void | Error> {
    return new Promise((Resolve, Reject) => {

    });
  }

}
