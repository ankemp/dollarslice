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
        this.serial.active
          .subscribe((dollar: any) => {
            if (dollar.status === 'complete') {
              // TODO: Check for duplicate serials
              /**
               * For now this just creates a new DB entry for every serial.
               * In the future, we need to create a serial-scan entry (RTDB),
               * when it's done scanning we need to search the Firestore DB for that serial and create a entry if it doesn't exist.
               * Then create relationships of serial to User
               * Then redirect to check-in flow
               */
              setTimeout(() => {
                const serialKey = this.serial.serialKey.getValue();
                this.router.navigate([`check-in/${serialKey}`]);
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
