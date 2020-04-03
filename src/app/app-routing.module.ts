import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { InDevelopmentComponent } from './core/in-development/in-development.component';
import { SearchResultsResolverService } from './search-results/search-results-resolver.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ContentResolverService } from './shared/content/content-resolver.service';

const routes: Routes = [
  { 
    path: '',
    component: HomeComponent,
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'starters',
    data: {
      title: 'Starters'
    },
    component: InDevelopmentComponent,
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'themes',
    component: InDevelopmentComponent,
    data: {
      title: 'Themes'
    },
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'sites',
    component: InDevelopmentComponent,
    data: {
      title: 'Sites'
    },
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'about',
    data: {
      title: 'About'
    },
    component: InDevelopmentComponent,
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'contributing',
    data: {
      title: 'Contributing'
    },
    component: InDevelopmentComponent,
    resolve: [ ContentResolverService ]
  },
  {
    path: 'search',
    component: SearchResultsComponent,
    resolve: {
      content: ContentResolverService,
      searchResults: SearchResultsResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    ContentResolverService,
    SearchResultsResolverService
  ]
})
export class AppRoutingModule { }
