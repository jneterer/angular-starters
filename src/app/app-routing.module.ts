import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDataResolverService } from './all-data/all-data-resolver.service';
import { AllDataComponent } from './all-data/all-data.component';
import { CategoriesResolverService } from './all-data/categories-resolver.service';
import { HomeComponent } from './core/home/home.component';
import { InDevelopmentComponent } from './core/in-development/in-development.component';
import { SearchResultsResolverService } from './search-results/search-results-resolver.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ContentResolverService } from './shared/content/content-resolver.service';

const routes: Routes = [
  { 
    path: '',
    data: {
      title: 'Home'
    },
    component: HomeComponent,
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'starters',
    data: {
      title: 'Starters',
      starterPage: true
    },
    component: AllDataComponent,
    resolve: {
      content: ContentResolverService,
      allData: AllDataResolverService,
      categories: CategoriesResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { 
    path: 'themes',
    component: AllDataComponent,
    data: {
      title: 'Themes',
      starterPage: true
    },
    resolve: {
      content: ContentResolverService,
      allData: AllDataResolverService,
      categories: CategoriesResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { 
    path: 'sites',
    component: AllDataComponent,
    data: {
      title: 'Sites',
      starterPage: true
    },
    resolve: {
      content: ContentResolverService,
      allData: AllDataResolverService,
      categories: CategoriesResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
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
    AllDataResolverService,
    CategoriesResolverService,
    ContentResolverService,
    SearchResultsResolverService
  ]
})
export class AppRoutingModule { }
