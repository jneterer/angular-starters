import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from 'core/sign-in/sign-in.component';
import { PrivateGuard } from 'shared/guards/private/private.guard';
import { PublicGuard } from 'shared/guards/public/public.guard';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent, canActivate: [PublicGuard] },
  {
    path: 'app',
    loadChildren: () => import('./private/private.module').then(m => m.PrivateModule),
    canLoad: [PrivateGuard]
  },
  {
    path: '**',
    redirectTo: 'sign-in',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
