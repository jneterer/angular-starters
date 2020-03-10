import { Component, Input, OnInit } from '@angular/core';
import { IHeroData } from '../../../contracts/components/hero/ihero-data';

@Component({
  selector: '[app-hero]',
  templateUrl: './hero.component.html'
})
export class HeroComponent implements OnInit {
  @Input() heroData: IHeroData;

  constructor() { }

  ngOnInit(): void {
  }

}
