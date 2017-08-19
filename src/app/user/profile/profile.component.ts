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
    setTimeout(() => {
      document.getElementById(`${fieldName}-field`).focus();
    }, 50);
  }

  checkField(fieldName: string): boolean {
    return (this.activeField === fieldName);
  }

  private validateEmail(email: string): boolean {
    return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email));
  }

  updateEmail(): void {
    const { email } = this.profileFields;
    if (this.validateEmail(email)) {
      this.userService.updateProfile('email', email)
        .then((() => this.successProfileEdit()))
        .catch(err => {
          console.error(err);
        });
    } else {
      console.error('updateEmail() - Email invalid');
    }
  }

  private validateDisplayName(displayName: string): boolean {
    return (/^[a-zA-Z0-9'!#$%&'*+/=?^_`{|}~.-]*$/.test(displayName));
  }

  updateDisplayName(): void {
    const { displayName } = this.profileFields;
    if (this.validateDisplayName(displayName)) {
      this.userService.updateProfile('displayName', displayName)
        .then((() => this.successProfileEdit()))
        .catch(err => {
          console.error(err);
        });
    } else {
      console.error('updateDisplayName() - displayName invalid');
    }
  }

  updateProfileImage(): void {
    // this.fileService.upload().then(() => {
    //   this.userService.updateProfile('profileURL', )
    // })
  }

  private successProfileEdit(): void {
    this.endEdit();
    console.log('Profile Updated');
  }

}
