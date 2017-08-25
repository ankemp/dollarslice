import { Component, OnInit, OnDestroy } from '@angular/core';

import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera-lens',
  templateUrl: './lens.component.html',
  styleUrls: ['./lens.component.css']
})
export class LensComponent implements OnInit, OnDestroy {
  constructor(
    public camera: CameraService,
  ) { }

  ngOnInit(): void {
    this.camera.hasPermission()
      .then(status => {
        if (status) {
          this.removeLenseCap();
        } else {
          console.log('show notification about needing permission.');
          this.camera.requestPermission()
            .then(() => {
              this.removeLenseCap();
            })
            .catch(err => {
              console.error('Permission Rejected?', err);
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.camera.stopStream();
  }

  private removeLenseCap(): void {
    this.camera.setElements();
    this.camera.startStream();
  }
}
