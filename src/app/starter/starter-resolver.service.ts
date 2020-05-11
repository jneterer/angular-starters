import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ISearchResult } from '../contracts/search/isearch-result';
import { StartersService } from '../services/starters.service';

@Injectable({
  providedIn: 'root'
})
export class StarterResolverService implements Resolve<any>  {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISearchResult> {
    const params: Params = route.params;
    const owner: string = params.owner;
    const name: string = params.name;
    if (state.url.startsWith('/starter')) {
      return this.startersService.getData('starter', name, owner);
    } else if (state.url.startsWith('/theme')) {
      return this.startersService.getData('theme', name, owner);
    }
    return this.startersService.getData('site', name);
  }
}
