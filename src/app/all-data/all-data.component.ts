import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICategory } from '../contracts/categories/icategory';
import { ISearchResult } from '../contracts/search/isearch-result';

@Component({
  selector: 'app-all-data',
  templateUrl: './all-data.component.html'
})
export class AllDataComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  mediaQuery: MediaQueryList;
  private mediaQueryEvent: () => void;
  mediaMatches: boolean = false;
  title: string;
  allData: ISearchResult[];
  categories: ICategory[] = [];
  filterableCategories: {} = {};
  sidenavOpened: boolean = true;

  constructor(private route: ActivatedRoute,
              private mediaMatcher: MediaMatcher,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe))
    .subscribe((data: { title: string, allData: ISearchResult[], categories: ICategory[] }) => {
      // Clear the filterable categories for when the data is refreshed/changes.
      this.filterableCategories = {};
      this.title = data.title;
      this.allData = data.allData;
      this.categories = data.categories;
      // Loop through the data to get the filterable categories. We only want to show the categories
      // that are still filterable based on the data.
      this.allData.forEach((result: ISearchResult) => {
        // Loop through the categories for this result, add it to the filterable categories object,
        // set the total number of starters that include this category, and set its name.
        result.categories.forEach((category: string) => {
          if (this.filterableCategories[category]) {
            this.filterableCategories[category].total = this.filterableCategories[category].total + 1;
          } else {
            this.filterableCategories[category] = {
              total: 1,
              name: this.categories.find((categoryObject: {}) => categoryObject['category_id'] === category)['name']
            }
          }
        });
      });
    });
    // Listen for when the viewport changes between below and above an iPad. This helps
    // toggle the sidenav, show/hide the filter button, and set the top of the sidenav
    // depending on the viewport.
    this.mediaQuery = this.mediaMatcher.matchMedia('(max-width: 1023px)');
    this.mediaQueryEvent = () => {
      this.mediaMatches = this.mediaQuery.matches;
      this.sidenavOpened = !this.mediaQuery.matches;
      this.changeDetector.detectChanges();
    }
    if (this.mediaQuery.matches) {
      this.mediaMatches = true;
      this.sidenavOpened = false;
    } else {
      this.mediaMatches = false;
      this.sidenavOpened = true;
    }
    this.mediaQuery.addEventListener('change', this.mediaQueryEvent);
  }

  /**
   * Toggles the sidenav state between opened and closed.
   */
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.changeDetector.detach();
    this.mediaQuery.removeEventListener('change', this.mediaQueryEvent);
  }

}
