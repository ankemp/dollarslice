import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

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
  public profileUploading = false;
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

  logout(): void {
    this.userService.logout();
  }

  endEdit(): void {
    this.activeField = '';
  }

  startEdit(fieldName: string, focusField = true): void {
    this.activeField = fieldName;
    if (focusField) {
      setTimeout(() => {
        document.getElementById(`${fieldName}-field`).focus();
      }, 50);
    }
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

  validateProfileImage(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      return false;
    }
    if (file.size > 1000000) {
      return false;
    }
    return true;
  }

  updateProfileImage(): void {
    const input = <HTMLFormElement>document.getElementById('photo-field');
    const file = input.files[0];
    if (this.validateProfileImage(file)) {
      this.profileUploading = true;
      this.user.subscribe(state => {
        if (state) {
          this.fileService.upload(state.uid, file, 'users')
            .then(fileSnapshot => {
              this.profileUploading = false;
              return fileSnapshot.downloadURL;
            })
            .then((filePath: string) => {
              this.profileFields.photoURL = filePath;
              return filePath;
            })
            .then((filePath: string) => this.userService.updateProfile('photoURL', filePath))
            .then(() => this.successProfileEdit())
            .catch(err => {
              console.error(err);
            });
        }
      });
    } else {
      console.error('updateProfileImage() - file error');
    }
  }

  private successProfileEdit(): void {
    this.endEdit();
    console.log('Profile Updated');
  }

}
