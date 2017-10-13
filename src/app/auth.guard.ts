import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

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

  canActivate(): Promise<boolean> {
    return new Promise(Resolve => {
      this.user.subscribe(state => {
        if (state) {
          return Resolve(true);
        }
        this.router.navigate(['/user/signup']);
        return Resolve(false);
      });
    });
  }
}
