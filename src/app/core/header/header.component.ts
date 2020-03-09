import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITheme } from '../../contracts/shared/theme';
import { ContentService } from '../../shared/content/content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  currentTheme: ITheme;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.currentThemeConfig$.pipe(takeUntil(this.unsubscribe)).subscribe((theme: ITheme) => this.currentTheme = theme);
  }

  /**
   * Toggles the theme between light and dark.
   * @param {MouseEvent} event 
   */
  toggleTheme(event: MouseEvent): void {
    this.contentService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
