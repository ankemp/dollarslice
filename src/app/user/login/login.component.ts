import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public phoneNumber = '';
  public signInSubmitted = false;
  public captchaSubmitted = false;
  public confirmationCode = '';
  public confirmationSubmitted = false;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.registerRecaptcha();
  }

  resetSignIn(): void {
    this.signInSubmitted = false;
  }

  signInSubmit(): void {
    this.signInSubmitted = true;
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

  signInConfirm(): void {
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
