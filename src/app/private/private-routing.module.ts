import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from 'shared/guards/private/private.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivateComponent } from './private.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate: [PrivateGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/app/dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [PrivateGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
