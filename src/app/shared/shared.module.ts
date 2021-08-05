import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
