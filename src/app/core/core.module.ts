import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignInComponent } from 'core/sign-in/sign-in.component';

@NgModule({
  declarations: [
    SignInComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
