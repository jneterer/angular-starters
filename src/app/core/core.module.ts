import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from 'core/sign-in/sign-in.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    FooterComponent,
    HomeComponent,
    SignInComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CoreModule { }
