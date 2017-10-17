import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { UserService } from './user.service';
import { SerialService } from './serial.service';
import { LocationService } from './location.service';

@Injectable()
export class CheckInService {
  private activeRef: AngularFirestoreDocument<any>;
  public active: Observable<any>;
  public checkInKey = new BehaviorSubject<string>(null);

  constructor(
    private sdb: AngularFirestore,
    private user: UserService,
    private serial: SerialService,
    private location: LocationService
  ) { }

  private get checkInCollection(): AngularFirestoreCollection<any> {
    return this.sdb.collection('check-in');
  }

  lookup(id: string): AngularFirestoreDocument<any> {
    const currentId = this.checkInKey.getValue();
    if (id !== currentId) {
      this.activeRef = this.checkInCollection.doc(id);
      this.active = this.activeRef.valueChanges();
    }
    return this.activeRef;
  }

  create(): Promise<firebase.firestore.DocumentReference> {
    const promise = this.checkInCollection.add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: this.user.lookup().ref,
      location: this.location.lookup().ref,
      serial: this.serial.lookup().ref,
    });
    return promise;
  }

}
