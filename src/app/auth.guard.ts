import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from './services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private user: Observable<firebase.User>;

  constructor(
    public router: Router,
    userService: UserService,
  ) {
    this.user = userService.user;
  }

  canActivate(): Observable<any> {
    this.router.navigate(['/user/signup']);
    return this.user;
  }
}
