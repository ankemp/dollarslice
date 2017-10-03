import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  @Input() object: Observable<any>;
  public isComplete = false;

  constructor() { }

  ngOnInit(): void {
    this.object.subscribe((o: any) => {
      if (o.status === 'complete') {
        setTimeout(() => {
          this.isComplete = true;
        }, 1000);
      }
    });
  }

}
