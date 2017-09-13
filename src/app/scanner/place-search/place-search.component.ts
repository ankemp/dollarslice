import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LocationService } from '../../services/location.service';
import { SearchService } from '../../services/search.service';
import { SerialService } from '../../services/serial.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {
  public locating = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    public location: LocationService,
    public search: SearchService,
    private serial: SerialService
  ) { }

  ngOnInit() {
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
        console.error(err);
        this.locating.next(false);
      });
  }

  searchYelp(): void {
    const coords = this.location.coords.getValue();
    this.search.query(coords);
  }

  chooseLocation(location): void {
    this.location.checkIn()
      .then(locationKey => {
        console.log(locationKey);
        // create checkin entry
      });
  }

}
