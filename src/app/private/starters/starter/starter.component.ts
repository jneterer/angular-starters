import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Starter } from 'contracts/starters/starter';
import { StarterForm } from 'private/shared/components/starter-form/starter-form.component';
import { StartersService } from 'private/shared/services/starters/starters.service';
import { of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit, OnDestroy {
  user: User | null = null;
  starter: Starter | undefined;
  saveStarterError: string = '';
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private startersService: StartersService,
  ) { }

  ngOnInit(): void {
    this.supabaseService.$user.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((user: User | null) => this.user = user);
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(({ starter }: Data) => {
      this.starter = starter;
    });
  }

  /**
   * Creates a new starter.
   * @param {Event} event
   */
  submitNewStarter([{ cover_photo, demo_url, ...starterFormValues }, coverHasChanged]: [StarterForm, boolean]): void {
    if (this.starter && this.user) {
      const categories: string[] = starterFormValues.categories.split(',');
      const imgType: string = cover_photo.substring("data:image/".length, cover_photo.indexOf(";base64"));
      const coverPhotoName: string = `${starterFormValues.starter_name}.${imgType}`;
      const coverPhotoBase64: string = cover_photo.split(',')[1];
      this.startersService.updateStarter(
        this.starter.id,
        {
          ...starterFormValues,
          demo_url: `https://${demo_url}`,
          categories,
          user_id: this.user.id,
          cover_photo: coverPhotoName
        }
      ).pipe(
        mergeMap((result: Starter) => {
          if (this.starter) {
            // Move and update the cover photo if the name has changed and the cover photo has changed.
            if (this.starter.cover_photo !== coverPhotoName && coverHasChanged) {
              return this.startersService.moveAndUpdateStarterCover(
                `${this.starter.user_id}/${this.starter.id}/${this.starter.cover_photo}`,
                `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`,
                coverPhotoBase64
              );
            } else if (this.starter.cover_photo !== coverPhotoName) {
              // Move the cover photo if the name has changed.
              return this.startersService.moveStarterCover(
                `${this.starter.user_id}/${this.starter.id}/${this.starter.cover_photo}`,
                `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`
              );
            } else if (coverHasChanged) {
              // Update the cover photo if the cover photo has changed.
              return this.startersService.updateStarterCover(
                `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`,
                coverPhotoBase64
              );
            }
          }
          this.starter = result;
          return of();
        })
      ).subscribe(() => { }, (error: Error) => {
        this.saveStarterError = error.message;
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}