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
    const userKey = this.user.userKey.getValue();
    const serialKey = this.serial.serialKey.getValue();
    const locationKey = this.location.locationKey.getValue();
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
    const promise = this.checkInCollection.add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userKey,
      location: this.location.lookup(locationKey).ref,
      serial: this.serial.lookup(serialKey).ref,
    });
    return promise;
  }

}
