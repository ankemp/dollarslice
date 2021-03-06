import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Guards
import { AuthGuard } from './auth.guard';

// Services
import { NavigatorRefService } from './services/navigator-ref.service';
import { WindowRefService } from './services/window-ref.service';
import { UserService } from './services/user.service';
import { FileStorageService } from './services/file-storage.service';
import { SerialService } from './services/serial.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    NavigatorRefService,
    WindowRefService,
    UserService,
    FileStorageService,
    SerialService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
