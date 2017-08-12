import { Injectable } from '@angular/core';

import { NavigatorRefService } from './navigator-ref.service';

@Injectable()
export class CameraService {
  private _navigator: Navigator;

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

}
