import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LocationService } from '../../services/location.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-locate-user',
  templateUrl: './locate-user.component.html',
  styleUrls: ['./locate-user.component.css']
})
export class LocateUserComponent {
  public locating = new BehaviorSubject<boolean>(false);

  constructor(
    public location: LocationService,
    private search: SearchService,
  ) { }

  findMe(highAccuracy = false): void {
    this.locating.next(true);
    this.location.getLocation(highAccuracy)
      .then((coords: Coordinates) => {
        this.locating.next(false);
      })
      .catch((err: PositionError) => {
        console.error(err);
        this.locating.next(false);
      });
  }

  searchYelp(): void {
    const coords = this.location.coords.getValue();
    this.search.query(coords);
  }

}
