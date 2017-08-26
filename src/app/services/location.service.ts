import { Injectable } from '@angular/core';

import { NavigatorRefService } from './navigator-ref.service';

@Injectable()
export class LocationService {
  private _navigator: Navigator;

  constructor(
    private navigatorService: NavigatorRefService,
  ) {
    this._navigator = navigatorService.nativeNavigator;
    if ('geolocation' in this._navigator) {
      console.log('geoLocation ready');
    } else {
      alert('Browser not supported');
    }
  }

  getLocation(): Promise<Coordinates | PositionError> {
    return new Promise((Resolve, Reject) => {
      this._navigator.geolocation
        .getCurrentPosition(position => {
          return Resolve(position.coords);
        }, err => {
          return Reject(err);
        });
    });
  }

}
