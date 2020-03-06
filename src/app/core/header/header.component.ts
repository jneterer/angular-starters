import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ETheme, ITheme } from '../../contracts/shared/theme';
import { ContentService } from '../../shared/content/content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  readonly theme: ITheme = {
    0: {
      logoUrl: '../../../assets/Angular Starters Logo.png',
      icon: 'brightness_3'
    },
    1: {
      logoUrl: '../../../assets/Dark Theme Logo.png',
      icon: 'wb_sunny'
    }
  };
  currentTheme: ETheme = ETheme.Light;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.theme$.pipe(takeUntil(this.unsubscribe)).subscribe((theme: ETheme) => this.currentTheme = theme);
  }

  /**
   * Toggles the theme between light and dark.
   * @param {MouseEvent} event 
   */
  toggleTheme(event: MouseEvent): void {
    this.contentService.setTheme(this.currentTheme === ETheme.Light ? ETheme.Dark : ETheme.Light);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
