import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClientService } from '../services/client.service';
import { SearchService } from '../services/search.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule.forRoot(),
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'angular-starters'}),
    MaterialModule,
    RouterModule,
  ],
  exports: [
    InlineSVGModule,
    CloudinaryModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ],
  providers: [
    ClientService,
    SearchService
  ]
})
export class SharedModule { }
