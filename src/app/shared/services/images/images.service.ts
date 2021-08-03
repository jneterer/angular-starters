import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environment';
import { from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  /**
   * Given an image's bucket and path, downloads it.
   * @param {string} bucket
   * @param {string} path
   * @returns {Observable<Blob>}
   */
  downLoadImage(bucket: string, path: string): Observable<Blob> {
    return from(this.supabase.storage.from(bucket).download(path))
      .pipe(
        mergeMap(({ data, error }: { data: Blob | null, error: Error | null }) => {
          if (error) {
            return throwError(error);
          } else if (!data) {
            return throwError({
              message: 'No image found at path: ' + path
            });
          }
          return of(data);
        })
      );
  }

}
