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
      logoUrl: '/assets/logo_light_theme.png',
      headerLogoUrl: '/assets/header_logo_light_theme.png',
      themeIcon: 'brightness_3',
      githubIcon: '/assets/github_light_theme.png',
      twitterIcon: '/assets/twitter_light_theme.png',
      linkedinIcon: '/assets/linkedin_light_theme.png'
    },
    1: {
      theme: 'dark',
      logoUrl: '/assets/logo_dark_theme.png',
      headerLogoUrl: '/assets/header_logo_dark_theme.png',
      themeIcon: 'wb_sunny',
      githubIcon: '/assets/github_dark_theme.png',
      twitterIcon: '/assets/twitter_dark_theme.png',
      linkedinIcon: '/assets/linkedin_dark_theme.png'
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
