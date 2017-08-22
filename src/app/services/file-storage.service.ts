import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

@Injectable()
export class FileStorageService {
  private storageRef: firebase.storage.Reference;
  private bucket = 'gs://dollar-slice.appspot.com';

  constructor(
    @Inject(FirebaseApp) firebaseApp: firebase.app.App
  ) {
    this.storageRef = firebase
      .storage(firebaseApp)
      .refFromURL(this.bucket);
  }

  upload(name: string | number, blob: Blob | File, path = 'uploads'): firebase.storage.UploadTask {
    const ref = this.storageRef.child(`${path}/${name}`);
    return ref.put(blob);
  }

}
