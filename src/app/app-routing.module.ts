import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'core/home/home.component';
import { SignInComponent } from 'core/sign-in/sign-in.component';
import { PrivateGuard } from 'shared/guards/private/private.guard';
import { PublicGuard } from 'shared/guards/public/public.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', redirectTo: 'sign-in' },
  { path: 'sign-in', component: SignInComponent, canActivate: [PublicGuard] },
  {
    path: 'app',
    loadChildren: () => import('./private/private.module').then(m => m.PrivateModule),
    canLoad: [PrivateGuard]
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
