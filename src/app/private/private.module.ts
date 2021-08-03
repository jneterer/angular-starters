import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'shared/shared.module';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SupabaseImgComponent } from './shared/components/supabase-img/supabase-img.component';
import { NewSiteComponent } from './sites/new-site/new-site.component';
import { SitesComponent } from './sites/sites.component';
import { NewStarterComponent } from './starters/new-starter/new-starter.component';
import { StartersComponent } from './starters/starters.component';

@NgModule({
  declarations: [
    PrivateComponent,
    NewStarterComponent,
    NewSiteComponent,
    SitesComponent,
    StartersComponent,
    SupabaseImgComponent,
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
  ]
})
export class PrivateModule { }
