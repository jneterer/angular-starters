import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { PaginateStartersResponse } from 'contracts/starters/public';
import { Starter } from 'contracts/starters/starter';
import { environment } from 'environment';
import { from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StartersService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  /**
   * Given a starter id, queries and returns it from the DB.
   * @param {string} starterId
   * @returns {Observable<Starter>}
   */
  getStarter(starterId: string): Observable<Starter> {
    return from(
      this.supabase.from('starters').select(`
        *,
        user:user_id ( * )
      `).eq('id', starterId).eq('has_been_active', true).neq('status', 'REMOVED')
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<Starter>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return throwError({
            message: `No starter found with id ${starterId}.`,
          });
        }
        return of(data[0]);
      }),
    );
  }

  /**
   * Gets the user's starters.
   * @param {number} start
   * @param {number} end
   * @returns {Observable<PaginateStartersResponse>}
   */
  getStarters(start: number, end: number): Observable<PaginateStartersResponse> {
    return from(
      this.supabase.from('starters').select(`
        *,
        user:user_id ( * )
      `, { count: 'exact' }).eq('has_been_active', true).neq('status', 'REMOVED').range(start, end)
    ).pipe(
      mergeMap(({ data, error, count }: PostgrestResponse<Starter>) => {
        if (error) {
          return throwError(error);
        }
        return of({
          starters: data ? data : [],
          total: count ? count : 0
        });
      }),
    );
  }

}
