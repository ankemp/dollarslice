import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SerialService {
  private activeRef: AngularFireObject<any>;
  public active: Observable<any>;
  public serialKey = new BehaviorSubject<string>(null);

  constructor(
    private db: AngularFireDatabase
  ) { }

  private serialList(): AngularFireList<any> {
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
    this.activeRef = this.db.object(`serial/${key}`);
    this.active = this.activeRef.valueChanges();
    this.serialKey.next(key);
  }

}
