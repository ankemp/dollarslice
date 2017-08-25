import { Injectable } from '@angular/core';

function getNavigator(): any {
  return navigator;
}

@Injectable()
export class NavigatorRefService {

  get nativeNavigator(): Navigator {
    return getNavigator();
  }

}
