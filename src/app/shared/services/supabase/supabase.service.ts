import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environment';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private session: BehaviorSubject<Session | null> = new BehaviorSubject<Session | null>(null);
  public $session: Observable<Session | null> = this.session.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => this.session.next(session));
  }

  /**
   * Signs the user in.
   * @returns {Observable<Error | null>}
   */
  signIn(): Observable<Error | null> {
    return from(this.supabase.auth.signIn({
      provider: 'github',
    })).pipe(mergeMap(({ error }) => {
      if (error) {
        return throwError(error);
      }
      return of(null);
    }));
  }

  /**
   * Signs the user in.
   * @returns {Observable<Error | null>}
   */
  signOut(): Observable<Error | null> {
    return from(this.supabase.auth.signOut())
      .pipe(mergeMap(({ error }) => {
        if (error) {
          return throwError(error);
        }
        return of(null);
      }));
  }

  /**
   * Gets the current user's session.
   * @requires {Session | null}
   */
  get supabaseSession(): Session | null {
    return this.session.getValue();
  }

}
