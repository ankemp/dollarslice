import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.css']
})
export class PlaceSearchComponent implements OnInit {
  @Input() dollar: FirebaseObjectObservable<any>;

  constructor() { }

  ngOnInit() {
  }

}
