import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class SerialService {
  private activeRef: AngularFirestoreDocument<any>;
  public active: Observable<any>;
  private taskRef: AngularFireObject<any>;
  public task: Observable<any>;
  public serialKey = new BehaviorSubject<string>(null);

  constructor(
    private db: AngularFireDatabase,
    private sdb: AngularFirestore
  ) { }

  private get scanQueue(): AngularFireList<any> {
    return this.db.list('scan-queue');
  }

  private get serialList(): AngularFirestoreCollection<any> {
    return this.sdb.collection('serial');
  }

  newTask(): firebase.database.ThenableReference {
    const thenable = this.scanQueue.push({ status: 'new', timestamp: firebase.database.ServerValue.TIMESTAMP });
    thenable.then(({ key }) => {
      this.taskRef = this.db.object(`scan-queue/${key}`);
      this.task = this.taskRef.valueChanges();
    });
    return thenable;
  }

  lookup(id = this.serialKey.getValue()): AngularFirestoreDocument<any> {
    const currentId = this.serialKey.getValue();
    if (id !== currentId) {
      this.activeRef = this.serialList.doc(id);
      this.active = this.activeRef.valueChanges();
      this.serialKey.next(id);
    }
    return this.activeRef;
  }

}
