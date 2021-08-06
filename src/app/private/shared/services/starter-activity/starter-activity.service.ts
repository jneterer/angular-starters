import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { StarterActivity, StarterActivityDto } from 'contracts/starters/activity';
import { environment } from 'environment';
import { from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StarterActivityService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  /**
   * Gets activity for a specified starter.
   * @param {string} starterId
   * @returns {Observable<StarterActivity[]>}
   */
  getActivityForStarter(starterId: string): Observable<StarterActivity[]> {
    return from(
      this.supabase.from('starter_activity').select(`
        *,
        user:user_id ( * )
      `).eq('starter_id', starterId)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<StarterActivity>) => {
        if (error) {
          return throwError(error);
        }
        return of(data ? data.reverse() : []);
      }),
    );
  }

  /**
   * Creates an activity for a starter.
   * @param {StarterActivityDto} starterActivity
   * @returns {Observable<StarterActivity>}
   */
  createActivityForStarter(starterActivityDto: StarterActivityDto): Observable<StarterActivity> {
    return from(
      this.supabase.from('starter_activity').insert(starterActivityDto)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<StarterActivity>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return throwError({
            message: `No data returned from create activity.`,
          });
        }
        return of(data[0]);
      }),
    );
  }

  /**
   * Deletes all activity for a starter.
   * @param {string} starterId
   * @returns {Observable<undefined>}
   */
  deleteStarterActivities(starterId: string): Observable<undefined> {
    return from(
      this.supabase.from('starter_activity').delete().eq('starter_id', starterId)
    ).pipe(
      mergeMap(({ error }: PostgrestResponse<boolean>) => {
        if (error) {
          return throwError(error);
        }
        return of(undefined);
      }),
    );
  }

}
