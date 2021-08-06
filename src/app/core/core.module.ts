import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from 'core/sign-in/sign-in.component';
import { SharedModule } from 'shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { StarterComponent } from './starter/starter.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    SignInComponent,
    StarterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ]
})
export class CoreModule { }
