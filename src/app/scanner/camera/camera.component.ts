import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  imageTaken = false;
  image: FirebaseObjectObservable<any>;

  constructor(
    private db: AngularFireDatabase,
    public camera: CameraService,
  ) { }

  ngOnInit(): void {
    // prep user for incoming permission request
  }

  capture(): void {
    this.camera.capture();
    this.imageTaken = true;
  }

  upload(): void {
    this.camera.save()
      .then(key => {
        this.image = this.db.object(`images/${key}`);
      });
  }

  reset(): void {
    this.imageTaken = false;
    this.camera.startStream();
  }
}
