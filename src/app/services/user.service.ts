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
  public user: Observable<firebase.User>;
  private profileRef: AngularFirestoreDocument<any>;
  public profile: Observable<any>;
  public userKey = new BehaviorSubject<string>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private sdb: AngularFirestore
  ) {
    this.user = afAuth.authState;
    this.user.subscribe(state => {
      if (state) {
        this.lookup(state.uid);
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

  lookup(uid: string): AngularFirestoreDocument<any> {
    const currentUid = this.userKey.getValue();
    if (currentUid !== uid) {
      this.profileRef = this.userCollection.doc(uid);
      this.profile = this.profileRef.valueChanges();
      this.userKey.next(uid);
    }
    return this.profileRef;
  }

  private updateDB(uid: string, fields: any): Promise<void> {
    const { displayName, email, emailVerified, phoneNumber, photoURL } = fields;
    const profile = Object.assign({}, { displayName }, { email }, { emailVerified }, { phoneNumber }, { photoURL });
    const docRef = this.userCollection.doc(uid);
    return docRef.ref.get().then(document => {
      if (document.exists) {
        return docRef.update({ ...profile, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      }
      return docRef.set({ ...profile, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    });
  }

  updateProfile(field: string, value: string): Promise<null | Error> {
    return new Promise((Resolve, Reject) => {
      this.user.subscribe(state => {
        if (state) {
          switch (field) {
            case 'email':
              state.updateEmail(value)
                .then(Resolve).catch(Reject);
              break;

            case 'displayName':
              state.updateProfile({ displayName: value, photoURL: state.photoURL })
                .then(Resolve).catch(Reject);
              break;

            case 'photoURL':
              state.updateProfile({ displayName: state.displayName, photoURL: value })
                .then(Resolve).catch(Reject);
              break;

            default:
              Reject(new Error('No field given'));
              break;
          }
        }
      });
    });
  }

}
