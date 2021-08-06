import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { StarterRevision } from 'contracts/starters/starter';
import { environment } from 'environment';
import { from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StarterRevisionService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  /**
   * Gets the revision for a specified starter.
   * @param {string} starterId
   * @returns {Observable<StarterActivity[]>}
   */
  getStarterRevision(starterId: string): Observable<StarterRevision | null> {
    return from(
      this.supabase.from('starter_revisions').select().eq('id', starterId)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<StarterRevision>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return of(null);
        }
        return of(data[0]);
      }),
    );
  }

  /**
   * Creates a revision for a starter.
   * @param {StarterRevision} starterRevisionDto
   * @returns {Observable<StarterRevision>}
   */
  createUpdateStarterRevision(starterRevisionDto: StarterRevision): Observable<StarterRevision> {
    return from(
      this.supabase.from('starter_revisions').upsert(starterRevisionDto)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<StarterRevision>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return throwError({
            message: `No data returned from create starter revision.`,
          });
        }
        return of(data[0]);
      }),
    );
  }

  /**
   * Deletes a starter revision.
   * @param {string} starterId
   * @returns {Observable<undefined>}
   */
  deleteStarterRevision(starterId: string): Observable<undefined> {
    return from(
      this.supabase.from('starter_revisions').delete().eq('id', starterId)
    ).pipe(
      mergeMap(({ error }: PostgrestResponse<boolean>) => {
        if (error) {
          return throwError(error);
        }
        return of(undefined);
      })
    );
  }

}
