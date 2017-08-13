import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { NavigatorRefService } from './services/navigator-ref.service';
import { TesseractJsRefService } from './services/tesseractjs-ref.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [NavigatorRefService, TesseractJsRefService],
  bootstrap: [AppComponent]
})
export class AppModule { }
