import { Component, OnInit, OnDestroy } from '@angular/core';

import { CameraService } from '../../services/camera.service';
import { FileStorageService } from '../../services/file-storage.service';
import { TesseractJsService } from '../../services/tesseractjs.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy {
  imageTaken = false;

  constructor(
    public camera: CameraService,
    public file: FileStorageService,
    public tesseract: TesseractJsService,
  ) { }

  ngOnInit(): void {
    // should show a reason to request first, then fire request.
    this.camera.requestPermission()
      .then(() => {
        this.camera.setElements();
        this.startStream();
      });
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

  private startStream(): void {
    this.camera.startStream();
  }

  private stopStream(): void {
    this.camera.stopStream();
  }

  capture(): void {
    this.camera.capture();
    const d = new Date();
    const n = d.getTime();
    this.camera.toBlob()
      .then((blob: Blob) => {
        console.log('Image Blob: ', blob);
        this.file.upload(n, blob);
      });
    this.imageTaken = true;
  }

  reset(): void {
    this.imageTaken = false;
    this.startStream();
  }
}
