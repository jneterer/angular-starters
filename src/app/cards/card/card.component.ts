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

}
