import { Component, Input } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  @Input() object: FirebaseObjectObservable<any>;

  constructor() { }

}
