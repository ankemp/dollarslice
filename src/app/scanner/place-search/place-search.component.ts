import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {
  @Input() dollar: FirebaseObjectObservable<any>;
  public yelpSearch: FirebaseObjectObservable<any>;
  public coords = new BehaviorSubject<Coordinates>(null);

  constructor(
    public db: AngularFireDatabase,
    public location: LocationService
  ) { }

  ngOnInit() { }

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
    this.location.findLocations(coords)
      .then(({ key }) => {
        this.yelpSearch = this.db.object(`/yelp-search/${key}`);
      });
  }

  chooseLocation(place): void {
    console.log(place);
  }

}
