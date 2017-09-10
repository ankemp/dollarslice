import { Component, Input, OnInit } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  @Input() object: FirebaseObjectObservable<any>;
  public isComplete = false;

  constructor() { }

  ngOnInit(): void {
    this.object.subscribe(o => {
      if (o.status === 'complete') {
        setTimeout(() => {
          this.isComplete = true;
        }, 1000);
      }
    });
  }

}
