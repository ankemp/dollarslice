import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private confirmationResult: firebase.auth.ConfirmationResult;
  user: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
  ) {
    this.user = afAuth.authState;
  }

  private signInSuccess(confirmationResult: firebase.auth.ConfirmationResult): void {
    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    this.confirmationResult = confirmationResult;
    console.log('signInSuccess', confirmationResult);
  }

  private signInError(error): void {
    console.error('signInError', error);
  }

  registerRecaptcha(): void {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  signIn(phoneNumber: string): void {
    this.afAuth.auth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
      .then(this.signInSuccess)
      .catch(this.signInError);
  }

  signInConfirmation(confirmCode: string): void {
    this.confirmationResult.confirm(confirmCode);
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }

}
