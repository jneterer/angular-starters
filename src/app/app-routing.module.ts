import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'core/home/home.component';
import { SignInComponent } from 'core/sign-in/sign-in.component';
import { StarterComponent } from 'core/starter/starter.component';
import { PrivateGuard } from 'shared/guards/private/private.guard';
import { PublicGuard } from 'shared/guards/public/public.guard';
import { StarterResolver } from 'shared/resolvers/starter/starter.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'starter/:id', component: StarterComponent, resolve: { starter: StarterResolver } },
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
  exports: [RouterModule],
  providers: [StarterResolver]
})
export class AppRoutingModule { }
