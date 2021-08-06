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
