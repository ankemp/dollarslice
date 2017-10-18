import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {
  private confirmation: firebase.auth.ConfirmationResult;
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private profileRef: AngularFirestoreDocument<any>;
  public profile: Observable<any>;
  public user: Observable<firebase.User>;
  public userKey = new BehaviorSubject<string>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private sdb: AngularFirestore
  ) {
    this.user = afAuth.authState;
    this.user.subscribe(({ uid, ...state }) => {
      if (state) {
        this.lookup(uid);
      }
    });
  }

  registerRecaptcha(): void {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  signIn(phoneNumber: string): Promise<null | Error> {
    return new Promise((Resolve, Reject) => {
      this.afAuth.auth
        .signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
        .then(confirmationResult => {
          this.confirmation = confirmationResult;
          Resolve();
        })
        .catch(err => Reject(err));

    });
  }

  signInConfirmation(confirmCode: string): Promise<null | Error> {
    return new Promise((Resolve, Reject) => {
      this.confirmation
        .confirm(confirmCode)
        .then(_ => Resolve())
        .catch(err => Reject(err));
    });
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }

  private get userCollection(): AngularFirestoreCollection<any> {
    return this.sdb.collection('user');
  }

  lookup(uid = this.userKey.getValue()): AngularFirestoreDocument<any> {
    const currentUid = this.userKey.getValue();
    if (currentUid !== uid) {
      this.profileRef = this.userCollection.doc(uid);
      this.profile = this.profileRef.valueChanges();
      this.userKey.next(uid);
    }
    return this.profileRef;
  }

  private updateDB(fields: any, uid = this.userKey.getValue()): Promise<void> {
    const profile = Object.assign({}, { ...fields });
    const docRef = this.userCollection.doc(uid);
    return docRef.ref.get().then(({ exists }) => {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      if (exists) {
        return docRef.update({ ...profile, updated: timestamp });
      }
      return docRef.set({ ...profile, created: timestamp, updated: timestamp });
    });
  }

  updateProfile(field: string, value: string): Promise<void> {
    const update = {};
    update[field] = value;
    return this.updateDB(update);
  }

}
