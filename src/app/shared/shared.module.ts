import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { SupabaseImgComponent } from './components/supabase-img/supabase-img.component';

@NgModule({
  declarations: [
    SupabaseImgComponent
  ],
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
    SupabaseImgComponent,
  ]
})
export class SharedModule { }
