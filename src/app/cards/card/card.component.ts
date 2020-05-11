import { Component, Input, OnInit } from '@angular/core';
import { ISearchResult } from 'src/app/contracts/search/isearch-result';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  @Input() searchResult: ISearchResult;

  constructor() { }

  ngOnInit(): void { }

  /**
   * Creates the url to the starter, theme, or site page.
   * @returns {string}
   */
  getUrl(): string {
    if (this.searchResult.type === 'site') {
      return `/site/${this.searchResult.name}`;
    }
    return `/${this.searchResult.type}/${this.searchResult.owner}/${this.searchResult.name}`;
  }

}
