import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, PostgrestResponse, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { UserProfile } from 'contracts/user/profile';
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
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public $user: Observable<User | null> = this.user.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.session.next(session);
      if (session) {
        const user: User | null = session.user;
        this.user.next(session.user);
        if (user) this.updateUserProfile(user);
      } else {
        this.user.next(null);
      }
    });
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

  /**
   * Given the current session's user, determines if the user's profile
   * exists in the DB. If not, it creates it. Otherwise, it determines if
   * the user's profile has been updated from GitHub and updates it in the DB.
   * @param {User} user
   */
  updateUserProfile(user: User): void {
    // Get the user's current profile. If it hasn't been saved before, or it has been updated from GitHub,
    // then upsert it (save or update).
    from(this.supabase.from('profiles').select('id, full_name, avatar_url, user_name'))
      .subscribe(({ data }: PostgrestResponse<UserProfile>) => {
        const userProfile: UserProfile | undefined | null = data ? data.find(({ id }: UserProfile) => id === user.id) : null;
        if (!userProfile || !!userProfile && (userProfile.full_name !== user.user_metadata.full_name || userProfile.avatar_url !== user.user_metadata.avatar_url || userProfile.user_name !== user.user_metadata.user_name)) {
          from(this.supabase.from('profiles').upsert({
            ...user.user_metadata,
            id: user.id,
          }, {
            returning: 'minimal',
          })).subscribe();
        }
      });
  }

}
