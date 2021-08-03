import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from 'shared/guards/private/private.guard';
import { PrivateComponent } from './private.component';
import { NewSiteComponent } from './sites/new-site/new-site.component';
import { SitesComponent } from './sites/sites.component';
import { NewStarterComponent } from './starters/new-starter/new-starter.component';
import { StartersComponent } from './starters/starters.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate: [PrivateGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/app/starters'
      },
      {
        path: 'starters',
        component: StartersComponent,
        canActivate: [PrivateGuard],
        children: [
        ]
      },
      {
        path: 'starters/new-starter',
        component: NewStarterComponent,
        canActivate: [PrivateGuard],
      },
      {
        path: 'sites',
        component: SitesComponent,
        canActivate: [PrivateGuard],
        children: [
        ]
      },
      {
        path: 'sites/new-site',
        component: NewSiteComponent,
        canActivate: [PrivateGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
