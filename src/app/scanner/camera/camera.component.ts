import { Component, OnInit, OnDestroy } from '@angular/core';

import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy {
  private player;
  private snapshot;
  private context;
  imageTaken = false;

  constructor(
    public camera: CameraService
  ) { }

  ngOnInit(): void {
    // should show a reason to request first, then fire request.
    this.camera.requestPermission()
      .then(() => {
        this.player = document.getElementById('viewport');
        this.snapshot = document.getElementById('snapshot');
        this.context = this.snapshot.getContext('2d');
        this.startStream();
      });
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

  private startStream(): void {
    this.camera.getStream()
      .then((stream: MediaStream) => {
        this.player.srcObject = stream;
      });
  }

  private stopStream(): void {
    this.player.srcObject.getVideoTracks()
      .forEach(track => track.stop());
  }

  capture(): void {
    this.context.drawImage(this.player, 0, 0, this.snapshot.width, this.snapshot.height);
    this.stopStream();
    this.imageTaken = true;
  }

  reset(): void {
    this.imageTaken = false;
    this.startStream();
  }
}
