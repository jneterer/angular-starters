import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { StarterActivity } from 'contracts/starters/activity';
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
      this.supabase.from('starter_activity').select().eq('starter_id', starterId)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<StarterActivity>) => {
        if (error) {
          return throwError(error);
        }
        return of(data || []);
      }),
    );
  }

}
