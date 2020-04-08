import { Component, Input, OnInit } from '@angular/core';
import { ISearchResult } from '../contracts/search/isearch-result';

@Component({
  selector: '[app-cards]',
  templateUrl: './cards.component.html'
})
export class CardsComponent implements OnInit {
  @Input() groupTitle: string;
  @Input() searchResultGroup: ISearchResult[];

  constructor() { }

  ngOnInit(): void { }

}
