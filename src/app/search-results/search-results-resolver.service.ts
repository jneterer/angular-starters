import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../services/search.service';
import { IGlobalSearchResult } from '../contracts/search/iglobal-search-result';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsResolverService {

  constructor(private router: Router,
              private searchService: SearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGlobalSearchResult[]> | Promise<boolean> {
    const queryParams: Params = route.queryParams;
    if (queryParams.searchTerm) {
      return this.searchService.search(route.queryParams.searchTerm);
    }
    return this.router.navigate(['/']);
  }
}
