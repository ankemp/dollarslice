import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './scanner-routing.module';

import { CameraService } from '../services/camera.service';

import { CameraComponent } from './camera/camera.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  declarations: [
    CameraComponent
  ],
  providers: [CameraService]
})
export class ScannerModule { }
