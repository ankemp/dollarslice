import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../services/user.service';
import { FileStorageService } from '../../services/file-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: Observable<firebase.User>;
  public activeField = '';
  public profileFields = { displayName: '', email: '', photoURL: '' };

  constructor(
    private userService: UserService,
    private fileService: FileStorageService,
  ) {
    this.user = userService.user;
  }

  ngOnInit() {
    this.user.subscribe(state => {
      if (state) {
        this.profileFields.displayName = state.displayName;
        this.profileFields.email = state.email;
        this.profileFields.photoURL = state.photoURL;
      }
    });
  }

  endEdit(): void {
    this.activeField = '';
  }

  startEdit(fieldName: string): void {
    this.activeField = fieldName;
  }

  updateEmail(): void {
    const email = this.profileFields.email;
    // do email validation
    this.userService.updateProfile('email', email);
  }

  updateDisplayName(): void {
    const displayName = this.profileFields.displayName;
    // do displayName validation
    this.userService.updateProfile('displayName', displayName);
  }

  updateProfileImage(): void {
    // this.fileService.upload().then(() => {
    //   this.userService.updateProfile('profileURL', )
    // })
  }

}
