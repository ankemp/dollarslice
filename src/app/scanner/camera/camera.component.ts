import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  imageTaken = new Subject<boolean>();
  image: FirebaseObjectObservable<any>;

  constructor(
    private db: AngularFireDatabase,
    public camera: CameraService,
  ) {
    this.imageTaken.next(false);
  }

  capture(): void {
    this.camera.capture();
    this.imageTaken.next(true);
  }

  upload(): void {
    this.camera.save()
      .then(({ key }) => {
        this.image = this.db.object(`images/${key}`);
      });
  }

  reset(): void {
    this.imageTaken.next(false);
    this.camera.startStream();
  }
}
