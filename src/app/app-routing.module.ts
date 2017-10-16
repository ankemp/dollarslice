import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', loadChildren: 'app/scanner/scanner.module#ScannerModule', canActivate: [AuthGuard] },
  { path: 'stream', loadChildren: 'app/stream/stream.module#StreamModule' },
  { path: 'user', loadChildren: 'app/user/user.module#UserModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
