import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { FileStorageService } from './file-storage.service';
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

  private createDbEntry(): firebase.database.ThenableReference {
    const d = new Date();
    const n = d.getTime();
    const list = this.db.list('/images');
    return list.push({ user: 'test', status: 'new', timestamp: n, rTimestamp: 0 - n });
  }

  private toBlob(): Promise<Blob> {
    return new Promise(Resolve => {
      this.snapshot.toBlob(blob => {
        return Resolve(blob);
      });
    });
  }

  save(): Promise<firebase.database.DataSnapshot> {
    return new Promise(Resolve => {
      this.createDbEntry()
        .then(snapshot => {
          Resolve(snapshot);
          return Promise.resolve(snapshot);
        })
        .then((dbSnapshot: firebase.database.ThenableReference) => {
          this.toBlob()
            .then((blob: Blob) => {
              dbSnapshot.update({ status: 'uploading' });
              return this.file.upload(dbSnapshot.key, blob, 'images');
            })
            .then(fileSnapshot => fileSnapshot.ref.fullPath)
            .then(path => dbSnapshot.update({ status: 'ocr_queued', image: path }));
        });
    });
  }

}
