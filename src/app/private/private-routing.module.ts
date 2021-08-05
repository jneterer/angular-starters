import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from 'shared/guards/private/private.guard';
import { PrivateComponent } from './private.component';
import { MyStartersResolver } from './shared/resolvers/my-starters/my-starters.resolver';
import { StarterActivityResolver } from './shared/resolvers/starter-activity/starter-activity.resolver';
import { StarterResolver } from './shared/resolvers/starter/starter.resolver';
import { NewSiteComponent } from './sites/new-site/new-site.component';
import { SitesComponent } from './sites/sites.component';
import { NewStarterComponent } from './starters/new-starter/new-starter.component';
import { StarterComponent } from './starters/starter/starter.component';
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
        resolve: {
          starters: MyStartersResolver
        }
      },
      {
        path: 'starters/new-starter',
        component: NewStarterComponent,
        canActivate: [PrivateGuard],
      },
      {
        path: 'starters/:id',
        component: StarterComponent,
        canActivate: [PrivateGuard],
        resolve: {
          starter: StarterResolver,
          starterActivity: StarterActivityResolver,
        }
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
  exports: [RouterModule],
  providers: [MyStartersResolver, StarterResolver, StarterActivityResolver]
})
export class PrivateRoutingModule { }
