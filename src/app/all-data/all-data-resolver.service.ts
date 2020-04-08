import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ISearchResult } from '../contracts/search/isearch-result';
import { StartersService } from '../services/starters.service';

@Injectable({
  providedIn: 'root'
})
export class AllDataResolverService implements Resolve<any>  {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISearchResult[]> {
    // Gets page data based on the url.
    switch (state.url) {
      case '/starters':
        return this.startersService.getData('starter');
      case '/themes':
        return this.startersService.getData('theme');
      case '/sites':
        return this.startersService.getData('site');
      default:
        return this.startersService.getData('starter');
    }
  }

}
