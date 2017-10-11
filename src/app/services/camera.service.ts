import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { FileStorageService } from './file-storage.service';
import { SerialService } from './serial.service';
import { NavigatorRefService } from './navigator-ref.service';

@Injectable()
export class CameraService {
  private _navigator: Navigator;
  private constraints = <MediaStreamConstraints>{ video: { facingMode: { exact: 'environment' } } };

  public player: HTMLVideoElement;
  public snapshot: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(
    public db: AngularFireDatabase,
    public file: FileStorageService,
    private serial: SerialService,
    private navigatorService: NavigatorRefService,
  ) {
    this._navigator = navigatorService.nativeNavigator;
    if (this._navigator.mediaDevices && this._navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia ready');
    } else {
      alert('Browser not supported');
    }
  }

  requestPermission(): Promise<MediaStream> {
    return this._navigator.mediaDevices.getUserMedia(this.constraints);
  }

  hasPermission(): Promise<boolean> {
    return this._navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(device => device.kind === 'videoinput' && device.label))
      .then(videoDevices => {
        if (videoDevices.length >= 1) {
          return true;
        }
        return false;
      });
  }

  setElements(): void {
    this.player = <HTMLVideoElement>document.getElementById('viewport');
    this.snapshot = <HTMLCanvasElement>document.getElementById('snapshot');
    this.context = this.snapshot.getContext('2d');
  }

  startStream(): void {
    this._navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: MediaStream) => {
        this.player.srcObject = stream;
      });
  }

  stopStream(): void {
    this.player.srcObject
      .getVideoTracks()
      .forEach(track => track.stop());
  }

  capture(): void {
    this.context.drawImage(this.player, 0, 0, 500, 700);
    this.stopStream();
  }

  private toBlob(): Promise<Blob> {
    return new Promise(Resolve => {
      this.snapshot.toBlob(blob => {
        return Resolve(blob);
      });
    });
  }

  save(): Promise<void> {
    return new Promise(Resolve => {
      this.serial.newTask()
        .then(snapshot => {
          Resolve();
          return snapshot;
        })
        .then(snapshot => {
          this.toBlob()
            .then((blob: Blob) => {
              snapshot.update({ status: 'uploading' });
              return this.file.upload(snapshot.key, blob, 'serial');
            })
            .then(fileSnapshot => fileSnapshot.ref.fullPath)
            .then(path => snapshot.update({ status: 'ocr_queued', image: path }));
        });
    });
  }

}
