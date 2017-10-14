import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {
  private confirmation: firebase.auth.ConfirmationResult;
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public user: Observable<firebase.User>;
  public userKey = new BehaviorSubject<string>(null);

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.user = afAuth.authState;
    this.user.subscribe(state => {
      if (state) {
        this.userKey.next(state.uid);
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
          return Resolve();
        })
        .catch(err => Reject(err));

    });
  }

  signInConfirmation(confirmCode: string): Promise<null | Error> {
    return new Promise((Resolve, Reject) => {
      this.confirmation
        .confirm(confirmCode)
        .then(result => Resolve())
        .catch(err => Reject(err));
    });
  }

  logout(): void {
    this.afAuth.auth.signOut();
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
