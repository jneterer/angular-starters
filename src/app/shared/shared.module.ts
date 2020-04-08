import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClientService } from '../services/client.service';
import { SearchService } from '../services/search.service';
import { LinkTrackerDirective } from './directives/link-tracker.directive';
import { MaterialModule } from './material.module';
import { GoogleAnalyticsService } from './services/google-analytics.service';

@NgModule({
  declarations: [
    LinkTrackerDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule.forRoot(),
    MaterialModule,
    RouterModule
  ],
  exports: [
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    LinkTrackerDirective,
    MaterialModule,
    RouterModule
  ],
  providers: [
    ClientService,
    SearchService,
    GoogleAnalyticsService
  ]
})
export class SharedModule { }
