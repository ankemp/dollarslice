import { Directive, HostListener } from '@angular/core';

import { CameraService } from '../../services/camera.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[lensAutoOff]'
})
export class AutoOffDirective {

  constructor(
    private camera: CameraService
  ) { }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    this.camera.startStream();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    this.camera.stopStream();
  }

}
