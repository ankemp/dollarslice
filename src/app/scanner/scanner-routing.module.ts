import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CameraComponent } from './camera/camera.component';
import { PlaceSearchComponent } from './place-search/place-search.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'scan' },
      { path: 'scan', component: CameraComponent },
      { path: 'check-in/:serialKey', component: PlaceSearchComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
