import { Component, OnInit } from '@angular/core';

import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor(
    camera: CameraService
  ) { }

  ngOnInit() {
  }

}
