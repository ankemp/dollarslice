import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public user: Observable<firebase.User>;

  constructor(
    private userService: UserService
  ) {
    this.user = userService.user;
  }

  // TODO: Make header components for logged in & logged out:
  // https://stackoverflow.com/questions/38780436/how-to-switch-layouts-in-angular2/38783451#38783451
}
