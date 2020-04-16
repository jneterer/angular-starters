import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ISearchResult } from '../contracts/search/isearch-result';
import { StartersService } from '../services/starters.service';

@Injectable({
  providedIn: 'root'
})
export class AllDataResolverService implements Resolve<any>  {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISearchResult[]> {
    const queryParams: Params = route.queryParams;
    const categoryFilters: string[] = queryParams.c ? (<string>queryParams.c).split(',') : null;
    const angularVersionFilters: string[] = queryParams.v ? (<string>queryParams.v).split(',') : null;
    if (state.url.startsWith('/starter')) {
      return this.startersService.getData('starter', angularVersionFilters, categoryFilters);
    } else if (state.url.startsWith('/theme')) {
      return this.startersService.getData('theme', angularVersionFilters, categoryFilters);
    }
    return this.startersService.getData('site', angularVersionFilters, categoryFilters);
  }

}
