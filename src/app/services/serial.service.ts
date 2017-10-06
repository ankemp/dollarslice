import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class SerialService {
  private activeRef: AngularFirestoreDocument<any>;
  public active: Observable<any>;
  public serialKey = new BehaviorSubject<string>(null);

  constructor(
    private sdb: AngularFirestore
  ) { }

  private serialList(): AngularFirestoreCollection<any> {
    return this.sdb.collection('serial');
  }

  create(): Promise<firebase.firestore.DocumentReference> {
    const thenable = this.serialList().add({ status: 'new', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    thenable.then(document => {
      this.lookup(document.id);
    });
    return thenable;
  }

  lookup(id: string): void {
    this.activeRef = this.serialList().doc(id);
    this.active = this.activeRef.valueChanges();
    this.serialKey.next(id);
  }

}
