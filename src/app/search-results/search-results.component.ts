import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IGlobalSearchResult } from '../contracts/search/iglobal-search-result';
import { ISearchResultsResolverData } from '../contracts/search/isearch-results-resolver-data';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  private unsubscribe: Subject<any> = new Subject<any>();
  currentSearchTerm: string = '';
  searchResults: IGlobalSearchResult[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((queryParams: Params) => {
      this.currentSearchTerm = queryParams.searchTerm;
    });
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe((data: ISearchResultsResolverData) => {
      this.searchResults = data.searchResults;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
