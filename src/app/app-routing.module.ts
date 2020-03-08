import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ContentResolverService } from './shared/content/content-resolver.service';

const routes: Routes = [
  { 
    path: '', component: HomeComponent, resolve: [ ContentResolverService ]
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ContentResolverService]
})
export class AppRoutingModule { }
