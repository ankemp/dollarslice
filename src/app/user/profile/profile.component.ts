import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';

import { UserService } from '../../services/user.service';
import { FileStorageService } from '../../services/file-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profile: Observable<any>;
  public activeField = new BehaviorSubject<string>(null);
  public profileUploading = new BehaviorSubject<boolean>(false);
  public profileFields = { displayName: '', email: '', photoURL: '' };

  constructor(
    private user: UserService,
    private fileService: FileStorageService,
  ) {
    this.profile = user.profile;
  }

  ngOnInit() {
    this.user.lookup().ref.get().then(document => {
      if (document.exists) {
        const { displayName, email, photoURL } = document.data();
        this.profileFields = Object.assign({}, { displayName }, { email }, { photoURL });
      }
    });
  }

  endEdit(): void {
    this.activeField.next(null);
  }

  startEdit(fieldName: string, focusField = true): void {
    this.activeField.next(fieldName);
    if (focusField) {
      setTimeout(() => {
        document.getElementById(`${fieldName}-field`).focus();
      }, 50);
    }
  }

  private validateEmail(email: string): boolean {
    return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email));
  }

  updateEmail(): void {
    const { email } = this.profileFields;
    if (this.validateEmail(email)) {
      this.user.updateProfile('email', email)
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
      this.user.updateProfile('displayName', displayName)
        .then((() => this.successProfileEdit()))
        .catch(err => {
          console.error(err);
        });
    } else {
      console.error('updateDisplayName() - displayName invalid');
    }
  }

  private validateProfileImage(file: File): boolean {
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
    const [file] = input.files;
    if (this.validateProfileImage(file)) {
      this.profileUploading.next(true);
      const uid = this.user.userKey.getValue();
      this.fileService.upload(uid, file, 'users')
        .then(({ downloadURL }) => {
          this.profileUploading.next(false);
          return downloadURL;
        })
        .then((filePath: string) => {
          this.profileFields.photoURL = filePath;
          return filePath;
        })
        .then((filePath: string) => this.user.updateProfile('photoURL', filePath))
        .then(() => this.successProfileEdit())
        .catch(err => {
          console.error(err);
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
