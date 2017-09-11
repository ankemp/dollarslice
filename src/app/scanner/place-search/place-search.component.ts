import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LocationService } from '../../services/location.service';
import { SerialService } from '../../services/serial.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {
  public coords = new BehaviorSubject<Coordinates>(null);

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    public location: LocationService,
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
    this.location.getLocation(highAccuracy)
      .then((coords: Coordinates) => {
        this.coords.next(coords);
      })
      .catch((err: PositionError) => {
        console.error(err);
      });
  }

  searchYelp(): void {
    const coords = this.coords.getValue();
    this.location.searchYelp(coords);
  }

  chooseLocation(location): void {
    this.location.create(location)
      .then(locationKey => {
        console.log(locationKey);
        // create checkin entry
      });
  }

}
