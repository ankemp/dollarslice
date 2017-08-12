import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CameraComponent } from './camera/camera.component';

const routes: Routes = [
  { path: '', component: CameraComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
