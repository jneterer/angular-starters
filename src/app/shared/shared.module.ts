import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClientService } from '../services/client.service';
import { SearchService } from '../services/search.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule.forRoot(),
    MaterialModule,
    RouterModule,
  ],
  exports: [
    InlineSVGModule,
    FormsModule,
    MaterialModule,
    RouterModule,
  ],
  providers: [
    ClientService,
    SearchService
  ]
})
export class SharedModule { }
