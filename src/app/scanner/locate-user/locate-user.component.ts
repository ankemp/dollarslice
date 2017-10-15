import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LocationService } from '../../services/location.service';
import { SerialService } from '../../services/serial.service';

@Component({
  selector: 'app-locate-user',
  templateUrl: './locate-user.component.html',
  styleUrls: ['./locate-user.component.css']
})
export class LocateUserComponent {
  public locating = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: LocationService,
    private serial: SerialService,
  ) {
    if (!this.serial.active) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const key = params.get('serialKey');
        this.serial.lookup(key);
      });
    }
  }

  findMe(highAccuracy = false): void {
    this.locating.next(true);
    this.location.getLocation(highAccuracy)
      .then((coords: Coordinates) => {
        this.locating.next(false);
      })
      .catch((err: PositionError) => {
        this.locating.next(false);
      });
  }

  searchYelp(): void {
    const serial = this.serial.serialKey.getValue();
    this.router.navigate([`check-in/${serial}`]);
  }

}
