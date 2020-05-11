import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDataResolverService } from './all-data/all-data-resolver.service';
import { AllDataComponent } from './all-data/all-data.component';
import { AngularVersionsResolverService } from './all-data/angular-versions-resolver.service';
import { CategoriesResolverService } from './shared/resolvers/categories-resolver.service';
import { HomeComponent } from './core/home/home.component';
import { InDevelopmentComponent } from './core/in-development/in-development.component';
import { SearchResultsResolverService } from './search-results/search-results-resolver.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ClientGuard } from './services/client.guard';
import { ContentResolverService } from './shared/content/content-resolver.service';
import { StarterResolverService } from './starter/starter-resolver.service';
import { StarterComponent } from './starter/starter.component';

const routes: Routes = [
  { 
    path: '',
    data: {
      title: 'Home'
    },
    component: HomeComponent,
    canActivate: [ ClientGuard ],
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'starters',
    data: {
      title: 'Starters',
      starterPage: true
    },
    component: AllDataComponent,
    canActivate: [ ClientGuard ],
    resolve: {
      content: ContentResolverService,
      allData: AllDataResolverService,
      angularVersions: AngularVersionsResolverService,
      categories: CategoriesResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'starter/:owner/:name',
    component: StarterComponent,
    canActivate: [ ClientGuard ],
    resolve: {
      content: ContentResolverService,
      data: StarterResolverService,
      categories: CategoriesResolverService
    }
  },
  { 
    path: 'themes',
    component: AllDataComponent,
    data: {
      title: 'Themes',
      starterPage: true
    },
    canActivate: [ ClientGuard ],
    resolve: {
      content: ContentResolverService,
      allData: AllDataResolverService,
      angularVersions: AngularVersionsResolverService,
      categories: CategoriesResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'theme/:owner/:name',
    component: StarterComponent,
    canActivate: [ ClientGuard ],
    resolve: {
      content: ContentResolverService,
      data: StarterResolverService,
      categories: CategoriesResolverService
    }
  },
  { 
    path: 'sites',
    component: AllDataComponent,
    data: {
      title: 'Sites',
      starterPage: true
    },
    canActivate: [ ClientGuard ],
    resolve: {
      content: ContentResolverService,
      allData: AllDataResolverService,
      angularVersions: AngularVersionsResolverService,
      categories: CategoriesResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'site/:name',
    component: StarterComponent,
    canActivate: [ ClientGuard ],
    resolve: {
      content: ContentResolverService,
      data: StarterResolverService,
      categories: CategoriesResolverService
    }
  },
  { 
    path: 'about',
    data: {
      title: 'About'
    },
    canActivate: [ ClientGuard ],
    component: InDevelopmentComponent,
    resolve: [ ContentResolverService ]
  },
  { 
    path: 'contributing',
    data: {
      title: 'Contributing'
    },
    canActivate: [ ClientGuard ],
    component: InDevelopmentComponent,
    resolve: [ ContentResolverService ]
  },
  {
    path: 'search',
    component: SearchResultsComponent,
    canActivate: [ ClientGuard ],
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
    ClientGuard,
    ContentResolverService,
    SearchResultsResolverService,
    StarterResolverService
  ]
})
export class AppRoutingModule { }
