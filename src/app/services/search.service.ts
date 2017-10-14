import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

interface LongLat {
  longitude: number;
  latitude: number;
}

@Injectable()
export class SearchService {
  private activeRef: AngularFireObject<any>;
  public active: Observable<any>;

  constructor(
    private db: AngularFireDatabase,
  ) { }

  private get list(): AngularFireList<any> {
    return this.db.list('yelp-search');
  }

  private create({ longitude, latitude }: LongLat): firebase.database.ThenableReference {
    return this.list.push({
      status: 'query',
      latitude,
      longitude,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }

  lookup(key: string): void {
    this.activeRef = this.db.object(`yelp-search/${key}`);
    this.active = this.activeRef.valueChanges();
  }

  query(coords: Coordinates): firebase.database.ThenableReference {
    const thenable = this.create(coords);
    thenable.then(({ key }) => {
      this.lookup(key);
    });
    return thenable;
  }

}
