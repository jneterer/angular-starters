import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { Starter, StarterDto } from 'contracts/starters/starter';
import { environment } from 'environment';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
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
   * @returns {Observable<Starter[]>}
   */
  getMyStarters(): Observable<Starter[]> {
    return from(
      this.supabase.from('starters').select()
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<Starter>) => {
        if (error) {
          return throwError(error);
        }
        return of(data || []);
      }),
    );
  }

  /**
   * Creates a new starter.
   * @param {StarterDto} starterDto
   * @param {string} cover
   * @returns {Observable<Starter[] | null>}
   */
  createStarter(starterDto: StarterDto, cover: string): Observable<Starter | null> {
    return from(
      this.supabase.from('starters').insert(starterDto)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<Starter>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return throwError({
            message: 'No data returned from the server.',
          });
        }
        const starter: Starter | null = data[0];
        return forkJoin([
          of(starter),
          from(this.supabase.storage.from('starter-covers').upload(`${starter.user_id}/${starter.id}/${starter.cover_photo}`, decode(cover)))
        ]);
      }),
      mergeMap(([starter, { error }]: [Starter | null, { data: { Key: string } | null; error: Error | null }]) => {
        if (error) {
          return throwError(error);
        }
        return of(starter);
      })
    );
  }

}
