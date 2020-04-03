import { Component, Input, OnInit } from '@angular/core';
import { IGlobalSearchResult } from '../contracts/search/iglobal-search-result';

@Component({
  selector: '[app-cards]',
  templateUrl: './cards.component.html'
})
export class CardsComponent implements OnInit {
  @Input() groupTitle: string;
  @Input() searchResultGroup: IGlobalSearchResult;

  constructor() { }

  ngOnInit(): void { }

}
