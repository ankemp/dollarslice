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
    this.userService.signIn(this.phoneNumber);
  }

  signUpConfirm(): void {
    this.confirmationSubmitted = true;
    this.userService.signInConfirmation(this.confirmationCode);
  }

}
