import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  queryParams: object = {};
  readonly angularVersions: string[] = ['4','5','6','7','8','9'];
  filterableAngularVersions: object = {};
  filteredAngularVersion: string = null;
  categories: ICategory[] = [];
  filterableCategories: {} = {};
  filteredCategories: string[] = [];
  sidenavOpened: boolean = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mediaMatcher: MediaMatcher,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((queryParams: Params) => {
      this.queryParams = queryParams;
      this.filteredCategories = queryParams.c ? (<string>queryParams.c).split(',') : [];
      this.filteredAngularVersion = queryParams.v ? (<string>queryParams.v) : null;
      document.getElementById('sidenav-main-content').scrollTo(0, 0);
    });
    this.route.data.pipe(takeUntil(this.unsubscribe))
    .subscribe((data: { title: string, allData: ISearchResult[], categories: ICategory[] }) => {
      // Clear the filterable categories and filterable versions for when the data is refreshed/changes.
      this.filterableCategories = {};
      this.filterableAngularVersions = {};
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
              total: 1
            };
          }
        });
        // Add the angular version to the filterable versions object and set the total number of starters
        // that include this version and its name.
        const angularVersion: string = result.angular_version;
        if (this.filterableAngularVersions[angularVersion]) {
          this.filterableAngularVersions[angularVersion].total = this.filterableAngularVersions[angularVersion].total + 1;
        } else {
          this.filterableAngularVersions[angularVersion] = {
            total: 1
          };
        }
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
    this.mediaQuery.addListener(this.mediaQueryEvent);
  }

  /**
   * Toggles the sidenav state between opened and closed.
   */
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  /**
   * Determines if the filter is currently active.
   * @param {('angularVersion' | 'category')} filterType 
   * @param {string} filterId 
   * @returns {boolean}
   */
  activeFilter(filterType: ('angularVersion' | 'category'), filterId: string): boolean {
    return filterType === 'angularVersion' ? 
      (this.filteredAngularVersion === filterId) 
      :
      this.filteredCategories.includes(filterId);
  }

  /**
   * Updates the active version and category filters.
   * @param {MatCheckboxChange} event 
   * @param {('angularVersion' | 'category')} filterType 
   * @param {string} filterId 
   */
  filterChanged(event: MatCheckboxChange, filterType: ('angularVersion' | 'category'), filterId: string): void {
    let queryParams: {} = Object.assign({}, this.queryParams);
    console.log(queryParams);
    if (filterType === 'angularVersion') {
      console.log('filteredAngularVersion: ', this.filteredAngularVersion);
      if (this.filteredAngularVersion === filterId) {
        console.log('includes: ', filterId);
        this.filteredAngularVersion = null;
      } else {
        this.filteredAngularVersion = filterId;
      }
      console.log('filteredAngularVersions: ', this.filteredAngularVersion);
      if (this.filteredAngularVersion) {
        queryParams['v'] = this.filteredAngularVersion;
      }
    } else {
      console.log('filteredCategories: ', this.filteredCategories);
      if (this.filteredCategories.includes(filterId)) {
        this.filteredCategories.splice(this.filteredCategories.indexOf(filterId), 1);
      } else {
        this.filteredCategories.push(filterId);
      }
      console.log('filteredCategories: ', this.filteredCategories);
      let filter: string = '';
      this.filteredCategories.forEach((category: string, index) => {
        filter = filter + (index !== 0 ? `,${category}` : category);
      });
      queryParams['c'] = filter;
      if (!queryParams['c']) {
        delete queryParams['c'];
      }
    }
    console.log('queryParams: ', queryParams);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.changeDetector.detach();
    this.mediaQuery.removeListener(this.mediaQueryEvent);
  }

}
