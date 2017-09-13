import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

interface LongLat {
  longitude: number;
  latitude: number;
}

@Injectable()
export class SearchService {
  public active: FirebaseObjectObservable<any>;

  constructor(
    private db: AngularFireDatabase,
  ) { }

  private list(): FirebaseListObservable<any[]> {
    return this.db.list('yelp-search');
  }

  private create({ longitude, latitude }: LongLat): firebase.database.ThenableReference {
    return this.list()
      .push({
        status: 'query',
        latitude,
        longitude,
        created: firebase.database.ServerValue.TIMESTAMP
      });
  }

  lookup(key: string): void {
    this.active = this.db.object(`yelp-search/${key}`);
  }

  query(coords: Coordinates): firebase.database.ThenableReference {
    const thenable = this.create(coords);
    thenable.then(({ key }) => {
      this.lookup(key);
    });
    return thenable;
  }

}
