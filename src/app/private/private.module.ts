import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SitesComponent } from './sites/sites.component';
import { StartersComponent } from './starters/starters.component';

@NgModule({
  declarations: [
    PrivateComponent,
    StartersComponent,
    SitesComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
