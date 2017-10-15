import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { CameraService } from '../../services/camera.service';
import { SerialService } from '../../services/serial.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  imageTaken = new Subject<boolean>();

  constructor(
    private camera: CameraService,
    public serial: SerialService,
    private router: Router
  ) {
    this.imageTaken.next(false);
  }

  capture(): void {
    this.camera.capture();
    this.imageTaken.next(true);
  }

  upload(): void {
    this.camera.save()
      .then(_ => {
        this.serial.task
          .subscribe(({ status, serial }) => {
            if (status === 'complete') {
              this.serial.lookup(serial);
              setTimeout(() => {
                this.router.navigate([`locate/${serial}`]);
              }, 1000);
            }
          });
      });
  }

  reset(): void {
    this.imageTaken.next(false);
    this.camera.startStream();
  }
}
