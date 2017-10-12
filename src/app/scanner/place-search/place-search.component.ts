import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { LocationService } from '../../services/location.service';
import { SearchService } from '../../services/search.service';
import { SerialService } from '../../services/serial.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
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

  chooseLocation(place: any): void {
    this.location.findOrCreate(place)
      .then(id => {
        console.log('findOrCreate', id);
        // this.location.checkIn();
      });
  }

}
