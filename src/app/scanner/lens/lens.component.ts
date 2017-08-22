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
    this.camera.requestPermission()
      .then(() => {
        this.camera.setElements();
        this.camera.startStream();
      });
  }

  ngOnDestroy(): void {
    this.camera.stopStream();
  }
}
