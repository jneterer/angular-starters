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
   * Given a starter id, queries and returns it from the DB.
   * @param {string} starterId
   * @returns {Observable<Starter>}
   */
  getStarter(starterId: string): Observable<Starter> {
    return from(
      this.supabase.from('starters').select().eq('id', starterId)
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
          from(this.supabase.storage.from(environment.starterCoverBucket).upload(`${starter.user_id}/${starter.id}/${starter.cover_photo}`, decode(cover)))
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

  /**
   * Updates a starter.
   * @param {string} starterId
   * @param {StarterDto} starterDto
   * @returns {Observable<Starter>}
   */
  updateStarter(starterId: string, starterDto: StarterDto): Observable<Starter> {
    return from(
      this.supabase.from('starters').update(starterDto).eq('id', starterId)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<Starter>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return throwError({
            message: 'No data returned from the server.',
          });
        }
        return of(data[0]);
      }),
    );
  }

  /**
   * For a starter cover, moves its location ("rename") and updates the image.
   * @param {string} oldPath
   * @param {string} newPath
   * @param {string} cover
   * @returns {Observable<undefined>}
   */
  moveAndUpdateStarterCover(oldPath: string, newPath: string, cover: string): Observable<undefined> {
    // First update the path of the image in case they've moved it.
    return this.moveStarterCover(oldPath, newPath)
      .pipe(mergeMap(() => {
        // Lastly, update the cover photo.
        return this.updateStarterCover(newPath, cover);
      }));
  }

  /**
   * For a starter cover, moves its location ("rename").
   * @param {string} oldPath
   * @param {string} newPath
   * @returns {Observable<undefined>}
   */
  moveStarterCover(oldPath: string, newPath: string): Observable<undefined> {
    return from(this.supabase.storage.from(environment.starterCoverBucket).move(oldPath, newPath))
      .pipe(
        // First update the path of the image in case they've moved it.
        mergeMap(({ data, error }: { data: { message: string; } | null; error: Error | null; }) => {
          if (error) {
            return throwError(error);
          }
          // Lastly, update the cover photo.
          return of(undefined);
        }),
      );
  }

  /**
   * For a starter cover, updates the image.
   * @param {string} path
   * @param {string} cover
   * @returns {Observable<undefined>}
   */
  updateStarterCover(path: string, cover: string): Observable<undefined> {
    return from(this.supabase.storage.from(environment.starterCoverBucket).upload(path, decode(cover), { upsert: true }))
      .pipe(
        mergeMap(({ data, error }: { data: { Key: string } | null; error: Error | null }) => {
          if (error) {
            return throwError(error);
          }
          return of(undefined);
        })
      );
  }

}
