import { Injectable } from '@angular/core';

import { NavigatorRefService } from './navigator-ref.service';

@Injectable()
export class CameraService {
  private _navigator: Navigator;
  private constraints = { video: { facingMode: { exact: 'environment' } } };

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

  capture(): Promise<MediaStream> {
    return this._navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: MediaStream) => {
        return stream;
      });
  }

}
