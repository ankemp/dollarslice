import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

  logout(): void {
    this.userService.logout();
  }

}
