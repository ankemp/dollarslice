import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {
  private confirmation: firebase.auth.ConfirmationResult;
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public user: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
  ) {
    this.user = afAuth.authState;
  }

  registerRecaptcha(): void {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  signIn(phoneNumber: string): Promise<null | Error> {
    return new Promise((Resolve, Reject) => {
      this.afAuth.auth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
        .then(confirmationResult => {
          this.confirmation = confirmationResult;
          return Resolve();
        })
        .catch(err => {
          console.error(err);
          return Reject(err);
        });

    });
  }

  signInConfirmation(confirmCode: string): Promise<null | Error> {
    return new Promise((Resolve, Reject) => {
      this.confirmation.confirm(confirmCode)
        .then((result) => {
          console.log(result);
          return Resolve();
        })
        .catch((err) => {
          console.log(err);
          return Reject(err);
        });
    });
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }

}
