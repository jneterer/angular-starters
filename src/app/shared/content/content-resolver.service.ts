import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ETheme } from '../../contracts/shared/theme';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root',
})
export class ContentResolverService implements Resolve<any> {

  constructor(private contentService: ContentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    const currentTheme = this.contentService.getTheme();
    // Gets the theme setting from locale storage and safely converts it to an integer.
    const themeFromLocalStorage: ETheme = parseInt(localStorage.getItem('theme'), 10);
    // Only change the theme if the local storage theme is different than what is in the code.
    if (themeFromLocalStorage !== currentTheme) {
      // If the theme was saved in local storage, then set it as the theme. Otherwise set it
      // to light by default.
      this.contentService.setTheme(themeFromLocalStorage ? themeFromLocalStorage : ETheme.Light);
    }
    return;
  }
}