import { Component, Input, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';
import { IHeroData } from '../../../contracts/components/hero/ihero-data';

@Component({
  selector: '[app-hero]',
  templateUrl: './hero.component.html'
})
export class HeroComponent implements OnInit {
  @Input() heroData: IHeroData;

  constructor(private gaService: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  /**
   * Have to send the ga event here because it won't work in the actual html as a directive.
   * @param {MouseEvent} event 
   */
  externalLinkClick(event: MouseEvent): void {
    this.gaService.sendEvent('Outbound Link Click', this.heroData.location, this.heroData.buttonUrl);
  }

}
