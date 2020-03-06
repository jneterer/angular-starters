import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ETheme } from '../../contracts/shared/theme';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private theme: BehaviorSubject<ETheme> = new BehaviorSubject<ETheme>(ETheme.Light);
  public theme$: Observable<ETheme> = this.theme.asObservable();

  constructor() { }

  /**
   * Returns the current theme.
   * @returns {ETheme}
   */
  getTheme(): ETheme {
    return this.theme.getValue();
  }

  /**
   * Sets the theme on the behavior subject and in local storage.
   * @param {ETheme} theme 
   */
  setTheme(theme: ETheme): void {
    this.theme.next(theme);
    localStorage.setItem('theme', theme.toString());
  }
  
}
