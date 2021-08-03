import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated: boolean = this.isAuthenticated();
    console.log('is authenticated: ', isAuthenticated);
    if (!isAuthenticated) return true;
    return this.router.parseUrl('/app/dashboard');
  }

  /**
   * Determines if the user is authenticated.
   * @returns {boolean}
   */
  isAuthenticated(): boolean {
    return !!this.supabaseService.supabaseSession;
  };

}
