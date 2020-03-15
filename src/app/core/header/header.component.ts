import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  previousGlobalSearchQueries: {}[] = []
  globalSearchResults: {}[] = [];
  searchTerm: string = '';

  constructor(private contentService: ContentService,
              private searchService: SearchService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.currentThemeConfig$.pipe(takeUntil(this.unsubscribe)).subscribe((theme: ITheme) => this.currentTheme = theme);
    // Get any previous global search queries from the user's local storage.
    const previousGlobalSearchQueries: { queries: string[] } = this.getPreviousGlobalSearchQueries();
    this.previousGlobalSearchQueries = (previousGlobalSearchQueries ? previousGlobalSearchQueries.queries : []).reverse();
  }

  /**
   * Toggles the theme between light and dark.
   * @param {MouseEvent} event 
   */
  toggleTheme(event: MouseEvent): void {
    this.contentService.toggleTheme();
  }

  /**
   * Gets the previous global search queries from local storage.
   * @returns {IPreviousGlobalSearchQueries}
   */
  getPreviousGlobalSearchQueries(): IPreviousGlobalSearchQueries {
    return JSON.parse(localStorage.getItem('previousGlobalSearchQueries'));
  }

  /**
   * Performs typeahead search.
   * @param {KeyboardEvent} event 
   */
  typeahead(event: KeyboardEvent): void {
    this.search(this.searchTerm);
  }

  /**
   * If a user clicks or presses the enter key on a search result, it will save
   * their search query in local storage and perform a search.
   * @param {MouseEvent} event 
   */
  saveAndSearch(event: MouseEvent): void {
    let previousGlobalSearchQueries = [].concat(this.getPreviousGlobalSearchQueries() ? this.getPreviousGlobalSearchQueries().queries : []);
    if (!previousGlobalSearchQueries.includes(this.searchTerm)) {
      previousGlobalSearchQueries.push(this.searchTerm);
    } else {
      previousGlobalSearchQueries.splice(previousGlobalSearchQueries.indexOf(this.searchTerm), 1);
      previousGlobalSearchQueries.push(this.searchTerm);
    }
    if (previousGlobalSearchQueries.length > 10) {
      previousGlobalSearchQueries.slice(0, 10);
    }
    localStorage.setItem('previousGlobalSearchQueries', JSON.stringify({
      queries: previousGlobalSearchQueries
    }));
    this.previousGlobalSearchQueries = previousGlobalSearchQueries.reverse();
    this.search(this.searchTerm);
  }

  /**
   * Performs a search based on the search term only if the user has provided
   * more than 3 characters in the search term.
   * @param {string} searchTerm 
   */
  search(searchTerm: string): void {
    if (searchTerm.length >= 3) {
      this.searchService.globalSearch(searchTerm).subscribe((result: {}[]) => {
        this.globalSearchResults = result;
      }, (error) => {
        console.log(error);
      });
    } else {
      this.globalSearchResults = [];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
