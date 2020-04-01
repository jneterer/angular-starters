import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IGlobalSearchResult } from 'src/app/contracts/search/iglobal-search-result';
import { IPreviousGlobalSearchQueries } from '../../contracts/search/iprevious-global-search-queries';
import { ITheme } from '../../contracts/shared/theme';
import { SearchService } from '../../services/search.service';
import { ContentService } from '../../shared/content/content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  currentTheme: ITheme;
  readonly mappedNames: object = {
    starter: {
      name: 'Starters',
      baseUrl: '/starter/'
    },
    theme:{
      name: 'Theme',
      baseUrl: '/theme/'
    },
    site: {
      name: 'Site',
      baseUrl: '/site/'
    }
  };
  globalSearchResults: IGlobalSearchResult[] = [];
  searchTerm: string = '';

  constructor(private router: Router,
              private contentService: ContentService,
              private searchService: SearchService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.currentThemeConfig$.pipe(takeUntil(this.unsubscribe)).subscribe((theme: ITheme) => this.currentTheme = theme);
  }

  /**
   * Toggles the theme between light and dark.
   * @param {MouseEvent} event 
   */
  toggleTheme(event: MouseEvent): void {
    this.contentService.toggleTheme();
  }

  /**
   * Performs typeahead search.
   * @param {KeyboardEvent} event 
   */
  typeahead(event: KeyboardEvent): void {
    const searchTerm: string = this.searchTerm;
    if (searchTerm.length >= 3) {
      this.searchService.globalSearch(searchTerm).subscribe((result: IGlobalSearchResult[]) => {
        this.globalSearchResults = result;
      }, (error) => {
        console.log(error);
      });
    } else {
      this.globalSearchResults = [];
    }
  }

  /**
   * Navigates to the selected typeahead result.
   * @param {MouseEvent} event 
   */
  navigateToTypeaheadResult(event: MouseEvent): void {
    const searchTerm: string = this.searchTerm;
    if (searchTerm) {
      this.router.navigate(['/search']);
      this.resetGlobalSearchState();
    }
  }

  /**
   * Performs search when a user presses enter on the input only if there is a search term
   * but regardless of whether there are typeahead results.
   * @param {KeyboardEvent} event 
   */
  search(event: KeyboardEvent): void {
    const searchTerm: string = this.searchTerm;
    if (searchTerm) {
      this.router.navigate(['/search'], {
        queryParams: {
          searchTerm: searchTerm
        }
      });
      this.resetGlobalSearchState();
    }
  }

  /**
   * Resets the search term and current search results.
   */
  resetGlobalSearchState(): void {
    this.searchTerm = '';
    this.globalSearchResults = [];
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
