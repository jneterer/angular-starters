import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientService } from '../services/client.service';
import { SearchService } from '../services/search.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
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
