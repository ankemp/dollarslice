import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {
  @Input() dollar: FirebaseObjectObservable<any>;
  public yelpSearch: FirebaseListObservable<any>;
  public coords = new Subject<Coordinates>();

  constructor(
    public db: AngularFireDatabase,
    public location: LocationService
  ) { }

  ngOnInit() {
    this.coords.subscribe(coords => {
      console.log('Coords: ', coords);
    });
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
    this.db.list('/yelp-search')
      .push({ status: 'query', location: '' });
  }

}
