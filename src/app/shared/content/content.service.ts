import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ETheme, ITheme, IThemeConfig } from '../../contracts/shared/theme';
import { GoogleAnalyticsService } from '../services/google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private theme: BehaviorSubject<ETheme> = new BehaviorSubject<ETheme>(ETheme.Light);
  public theme$: Observable<ETheme> = this.theme.asObservable();
  private readonly themeConfig: IThemeConfig = {
    0: {
      theme: 'light',
      themeIcon: 'brightness_3'
    },
    1: {
      theme: 'dark',
      themeIcon: 'wb_sunny'
    }
  };
  private currentThemeConfig: BehaviorSubject<ITheme> = new BehaviorSubject<ITheme>(this.themeConfig[this.getTheme()]);
  public currentThemeConfig$: Observable<ITheme> = this.currentThemeConfig.asObservable();

  constructor(private gaService: GoogleAnalyticsService) { }

  /**
   * Returns the current theme.
   * @returns {ETheme}
   */
  getTheme(): ETheme {
    return this.theme.getValue();
  }

  /**
   * Toggles the theme of the app between light and dark mode.
   */
  toggleTheme(): void {
    const newTheme: ETheme = this.getTheme() === ETheme.Light ? ETheme.Dark : ETheme.Light;
    this.gaService.sendEvent('Toggle Theme', null, newTheme === ETheme.Light ? 'Light' : 'Dark');
    this.setTheme(newTheme);
  }

  /**
   * Sets the theme and the currentThemeConfig behavior subjects and its value in local storage.
   * @param {ETheme} newTheme 
   */
  setTheme(newTheme: ETheme): void {
    this.theme.next(newTheme);
    this.currentThemeConfig.next(this.themeConfig[newTheme]);
    localStorage.setItem('theme', newTheme.toString());
  }
  
}
