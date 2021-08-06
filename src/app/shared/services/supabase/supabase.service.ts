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
  private userProfile: BehaviorSubject<UserProfile | null> = new BehaviorSubject<UserProfile | null>(null);
  public $userProfile: Observable<UserProfile | null> = this.userProfile.asObservable();

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
        this.session.next(null);
        this.user.next(null);
        this.userProfile.next(null);
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
   * Gets the current user's profile.
   * @requires {UserProfile | null}
   */
  get supabaseUserProfile(): UserProfile | null {
    return this.userProfile.getValue();
  }

  /**
   * Gets the user's profile.
   * @param {string} userId
   * @returns {Observable<UserProfile>}
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    return from(this.supabase.from('profiles').select().eq('id', userId))
      .pipe(
        mergeMap(({ error, data }: PostgrestResponse<UserProfile>) => {
          if (error) {
            return throwError(error);
          } else if (!data) {
            return throwError({
              message: `No user profile found with id: ${userId}`
            });
          }
          const userProfile: UserProfile | undefined = data.find(({ id }: UserProfile) => id === userId);
          if (!userProfile) {
            return throwError({
              message: `No user profile found with id: ${userId}`
            });
          }
          return of(userProfile);
        }));
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
    from(this.supabase.from('profiles').select().eq('id', user.id))
      .subscribe(({ data }: PostgrestResponse<UserProfile>) => {
        const userProfile: UserProfile | undefined | null = data ? data.find(({ id }: UserProfile) => id === user.id) : null;
        if (!userProfile || !!userProfile && userProfile?.role === 'user' && (userProfile.full_name !== user.user_metadata.full_name || userProfile.avatar_url !== user.user_metadata.avatar_url || userProfile.user_name !== user.user_metadata.user_name)) {
          const updatedUserProfile = {
            ...user.user_metadata,
            id: user.id,
          };
          from(this.supabase.from('profiles').upsert(updatedUserProfile, {
            returning: 'minimal',
          })).subscribe(() => {
            this.userProfile.next(updatedUserProfile as UserProfile);
          });
        } else {
          this.userProfile.next(userProfile);
        }
      });
  }

}
