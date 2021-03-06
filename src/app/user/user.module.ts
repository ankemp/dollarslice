import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './user-routing.module';

import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
  ],
  declarations: [
    ProfileComponent,
    LoginComponent,
    SignUpComponent,
  ]
})
export class UserModule { }
