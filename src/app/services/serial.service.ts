import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class SerialService {
  public active: FirebaseObjectObservable<any>;

  constructor(
    private db: AngularFireDatabase
  ) { }

  private serialList(): FirebaseListObservable<any> {
    return this.db.list('serial');
  }

  create(): firebase.database.ThenableReference {
    const d = new Date();
    const n = d.getTime();
    const thenable = this.serialList().push({ status: 'new', timestamp: n, rTimestamp: 0 - n });
    thenable.then(({ key }) => {
      this.lookup(key);
    });
    return thenable;
  }

  lookup(key: string): void {
    this.active = this.db.object(`serial/${key}`);
  }

}
