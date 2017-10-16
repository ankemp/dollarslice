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
import { SearchService } from '../services/search.service';
import { CheckInService } from '../services/check-in.service';

import { AutoOffDirective } from './lens/auto-off.directive';

import { CameraComponent } from './camera/camera.component';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { LensComponent } from './lens/lens.component';
import { LocateUserComponent } from './locate-user/locate-user.component';

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
    AutoOffDirective,
    CameraComponent,
    PlaceSearchComponent,
    LensComponent,
    LocateUserComponent
  ],
  providers: [
    CameraService,
    LocationService,
    SearchService,
    CheckInService
  ]
})
export class ScannerModule { }
