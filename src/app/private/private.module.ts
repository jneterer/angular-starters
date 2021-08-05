import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'shared/shared.module';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { ActivityFeedComponent } from './shared/components/activity-feed/activity-feed.component';
import { StarterFormComponent } from './shared/components/starter-form/starter-form.component';
import { StatusDropdownComponent } from './shared/components/status-dropdown/status-dropdown.component';
import { StatusPillComponent } from './shared/components/status-pill/status-pill.component';
import { SupabaseImgComponent } from './shared/components/supabase-img/supabase-img.component';
import { NewSiteComponent } from './sites/new-site/new-site.component';
import { SitesComponent } from './sites/sites.component';
import { NewStarterComponent } from './starters/new-starter/new-starter.component';
import { StarterComponent } from './starters/starter/starter.component';
import { StartersComponent } from './starters/starters.component';

@NgModule({
  declarations: [
    ActivityFeedComponent,
    NewStarterComponent,
    NewSiteComponent,
    PrivateComponent,
    SitesComponent,
    StatusDropdownComponent,
    StarterComponent,
    StarterFormComponent,
    StartersComponent,
    StatusPillComponent,
    SupabaseImgComponent,
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
  ]
})
export class PrivateModule { }
