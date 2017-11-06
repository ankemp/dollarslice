import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { FileStorageService } from './file-storage.service';
import { SerialService } from './serial.service';
import { NavigatorRefService } from './navigator-ref.service';
import { WindowRefService } from './window-ref.service';

@Injectable()
export class CameraService {
  // https://github.com/GoogleChromeLabs/snapshot
  private _navigator: Navigator;
  private _window: Window;
  private SUPPORTS_IMAGE_CAPTURE = 'ImageCapture' in this._window;
  private SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in this._navigator;
  private streamConstraints: MediaStreamConstraints = {
    video: {
      facingMode: { exact: 'environment' },
      width: { ideal: 540 },
      height: { ideal: 960 }
    }
  };

  public player: HTMLVideoElement;
  public snapshot: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(
    public db: AngularFireDatabase,
    public file: FileStorageService,
    private serial: SerialService,
    private navigatorService: NavigatorRefService,
    private windowService: WindowRefService
  ) {
    this._navigator = navigatorService.nativeNavigator;
    this._window = windowService.nativeWindow;
    if (!this.SUPPORTS_MEDIA_DEVICES) {
      throw new Error('Browser not supported');
    }
  }

  requestPermission(): Promise<MediaStream> {
    return this._navigator.mediaDevices.getUserMedia(this.streamConstraints);
  }

  hasPermission(): Promise<boolean> {
    return this._navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(device => device.kind === 'videoinput' && device.label))
      .then(videoDevices => {
        if (videoDevices.length) {
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
      .getUserMedia(this.streamConstraints)
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
    this.snapshot.width = this.player.width;
    this.snapshot.height = this.player.height;
    this.context.drawImage(this.player, 0, -100);
    this.stopStream();
  }

  private async toBlob(canvas = this.snapshot, type = 'image/jpeg'): Promise<Blob> {
    const result: Promise<Blob> = new Promise((Resolve) => {
      canvas.toBlob((blob: Blob) => Resolve(blob), type);
    });
    return result;
  }

  save(): Promise<void> {
    return new Promise(Resolve => {
      this.serial.newTask()
        .then(snapshot => {
          Resolve();
          return snapshot;
        })
        .then(snapshot => {
          return this.toBlob()
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
