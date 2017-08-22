import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './scanner-routing.module';
import { AngularFireModule } from 'angularfire2';

import { CameraService } from '../services/camera.service';

import { CameraComponent } from './camera/camera.component';
import { LensComponent } from './lens/lens.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AngularFireModule,
  ],
  declarations: [
    CameraComponent,
    LensComponent
  ],
  providers: [CameraService]
})
export class ScannerModule { }
