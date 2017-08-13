import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './scanner-routing.module';
import { AngularFireModule } from 'angularfire2';

import { CameraService } from '../services/camera.service';
import { FileStorageService } from '../services/file-storage.service';
import { TesseractJsService } from '../services/tesseractjs.service';

import { CameraComponent } from './camera/camera.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AngularFireModule,
  ],
  declarations: [
    CameraComponent
  ],
  providers: [CameraService, FileStorageService, TesseractJsService]
})
export class ScannerModule { }
