import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { LocationService } from '../../services/location.service';
import { SearchService } from '../../services/search.service';
import { SerialService } from '../../services/serial.service';
import { CheckInService } from '../../services/check-in.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: LocationService,
    public search: SearchService,
    private serial: SerialService,
    private checkIn: CheckInService
  ) { }

  ngOnInit() {
    if (!this.serial.active) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const key = params.get('serialKey');
        this.serial.lookup(key);
      });
    }
    const coords = this.location.coords.getValue();
    if (coords) {
      this.search.query(coords);
    } else {
      const serial = this.serial.serialKey.getValue();
      this.router.navigate([`locate/${serial}`]);
    }
  }

  chooseLocation(place: any): void {
    this.location.findOrCreate(place)
      .then(id => {
        console.log('findOrCreate', id);
        this.checkIn.create();
      });
  }

}
