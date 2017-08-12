import { Injectable } from '@angular/core';

import { NavigatorRefService } from './navigator-ref.service';

@Injectable()
export class CameraService {
  private _navigator: Navigator;
  private constraints = <MediaStreamConstraints>{ video: { facingMode: { exact: 'environment' } } };

  public player: HTMLVideoElement;
  public snapshot: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(
    private navigatorService: NavigatorRefService
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

  toBlob(): Promise<Blob> {
    return new Promise(Resolve => {
      this.snapshot.toBlob(blob => {
        return Resolve(blob);
      });
    });
  }

}
