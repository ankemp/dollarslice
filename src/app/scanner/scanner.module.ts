import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './scanner-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AgmCoreModule } from '@agm/core';
import { NgMathPipesModule } from 'ngx-pipes';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';

import { CameraService } from '../services/camera.service';
import { LocationService } from '../services/location.service';

import { CameraComponent } from './camera/camera.component';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { LensComponent } from './lens/lens.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AngularFireModule,
    AgmCoreModule.forRoot({ apiKey: environment.googleMaps }),
    NgMathPipesModule,
    SharedModule
  ],
  declarations: [
    CameraComponent,
    PlaceSearchComponent,
    LensComponent
  ],
  providers: [
    CameraService,
    LocationService
  ]
})
export class ScannerModule { }
