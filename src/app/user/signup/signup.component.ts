import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  public phoneNumber = '';
  public signUpSubmitted = false;
  public captchaSubmitted = false;
  public confirmationCode = '';
  public confirmationSubmitted = false;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.registerRecaptcha();
  }

  resetSignUp(): void {
    this.signUpSubmitted = false;
  }

  signUpSubmit(): void {
    this.signUpSubmitted = true;
    if (this.phoneNumber.length === 10) {
      this.phoneNumber = `+1${this.phoneNumber}`;
    }
    this.userService.signIn(this.phoneNumber)
      .then(() => {
        this.captchaSubmitted = true;
      })
      .catch(err => {
        // handle error
      });
  }

  signUpConfirm(): void {
    this.confirmationSubmitted = true;
    this.confirmationCode = this.confirmationCode.toString();
    this.userService.signInConfirmation(this.confirmationCode)
      .then(() => {
        // Welcome & redirect to profile? Home?
      })
      .catch(err => {
        // handle error
      });
  }

}
