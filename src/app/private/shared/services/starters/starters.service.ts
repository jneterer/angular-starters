import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { StarterActivity, StarterActivityDto } from 'contracts/starters/activity';
import { Starter, StarterDto, StarterRevision } from 'contracts/starters/starter';
import { environment } from 'environment';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { StarterActivityService } from '../starter-activity/starter-activity.service';
import { StarterRevisionService } from '../starter-revision/starter-revision.service';

@Injectable({
  providedIn: 'root'
})
export class StartersService {
  private supabase: SupabaseClient;

  constructor(
    private starterActivityService: StarterActivityService,
    private starterRevisionService: StarterRevisionService
  ) {
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
        const starter: Starter = data[0];
        return forkJoin([
          of(starter),
          this.starterActivityService.createActivityForStarter({
            starter_id: starter.id,
            user_id: starter.user_id,
            comment: 'You created the starter.',
          })
        ]);
      }),
      mergeMap(([starter]: [Starter, StarterActivity]) => {
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
   * Updates a starter's status and creates an event for it.
   * @param {string} starterId
   * @param {StarterActivityDto} starterActivityDto
   * @param {StarterRevision} revision
   * @returns {Observable<[Starter, StarterActivity]>}
   */
  updateStarterStatus(starterId: string, starterActivityDto: StarterActivityDto, revision?: StarterRevision): Observable<[Starter, StarterActivity]> {
    return from(
      this.supabase.from('starters').update({
        status: starterActivityDto.to_status,
        ...(starterActivityDto.to_status === 'ACTIVE' && revision ? {
          has_been_active: true,
          ...revision,
          cover_photo: revision.cover_photo.split('_REVISION').filter((part: string) => !part.includes('_REVISION')).join(''),
        } : {}),
      }).eq('id', starterId)
    ).pipe(
      mergeMap(({ error, data }: PostgrestResponse<Starter>) => {
        if (error) {
          return throwError(error);
        } else if (!data || data.length === 0) {
          return throwError({
            message: 'No data returned from the server.',
          });
        }
        const starter: Starter = data[0];
        return forkJoin([
          of(starter),
          this.starterActivityService.createActivityForStarter(starterActivityDto)
        ]);
      }),
      mergeMap((starterAndStartActivity: [Starter, StarterActivity]) => {
        // If the status is changed to ACTIVE, we need to delete the starter revision,
        // and update the cover photo name.
        return forkJoin([
          of(starterAndStartActivity[0]),
          of(starterAndStartActivity[1]),
          starterActivityDto.to_status === 'ACTIVE' ? this.starterRevisionService.deleteStarterRevision(starterId) : of(undefined),
          (starterActivityDto.to_status === 'ACTIVE' && revision) ? this.moveStarterCover(
            `${revision.user_id}/${revision.id}/${revision.cover_photo}`,
            `${revision.user_id}/${revision.id}/${revision.cover_photo.split('_REVISION').filter((part: string) => !part.includes('_REVISION')).join('')}`
          ) : of(undefined)
        ]);
      }),
      mergeMap((starterAndStartActivity: [Starter, StarterActivity, undefined, undefined]) => {
        return forkJoin([
          of(starterAndStartActivity[0]),
          of(starterAndStartActivity[1]),
        ]);
      }),
    );
  };

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
        return this.upsertStarterCover(newPath, cover);
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
  upsertStarterCover(path: string, cover: string): Observable<undefined> {
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
