import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { StarterActivity } from 'contracts/starters/activity';
import { Starter, StarterRevision, StarterStatus } from 'contracts/starters/starter';
import { UserProfile } from 'contracts/user/profile';
import { StarterForm } from 'private/shared/components/starter-form/starter-form.component';
import { StarterActivityService } from 'private/shared/services/starter-activity/starter-activity.service';
import { StarterRevisionService } from 'private/shared/services/starter-revision/starter-revision.service';
import { StartersService } from 'private/shared/services/starters/starters.service';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userProfile: UserProfile | null = null;
  starter: Starter | undefined;
  starterRevision: StarterRevision | undefined;
  starterStatus: StarterStatus = 'ACTIVE';
  starterActivity: StarterActivity[] = [];
  deleteStarterError: string = '';
  saveStarterError: string = '';
  updateActivityError: string = '';
  comment: FormControl = new FormControl('', Validators.required);
  submitted: boolean = false;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private startersService: StartersService,
    private starterActivityService: StarterActivityService,
    private starterRevisionService: StarterRevisionService
  ) { }

  ngOnInit(): void {
    this.supabaseService.$user.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((user: User | null) => this.user = user);
    this.supabaseService.$userProfile.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((userProfile: UserProfile | null) => this.userProfile = userProfile);
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(({ starter, starterActivity, starterRevision }: Data) => {
      this.starter = starter;
      this.starterStatus = starter.status;
      this.starterActivity = starterActivity;
      this.starterRevision = starterRevision;
    });
  }

  /**
   * Saves the starter.
   * @param {Event} event
   */
  saveStarter([{ cover_photo, ...starterFormValues }, coverHasChanged]: [StarterForm, boolean]): void {
    if (this.starter && this.user) {
      const categories: string[] = starterFormValues.categories.split(',');
      const imgType: string = cover_photo.substring("data:image/".length, cover_photo.indexOf(";base64"));
      const coverPhotoName: string = `${starterFormValues.starter_name}${this.starter.has_been_active ? '_REVISION' : ''}.${imgType}`;
      const coverPhotoBase64: string = cover_photo.split(',')[1];
      // Create or update the starter revision if the starter has been live/active.
      if (this.starter.has_been_active) {
        this.starterRevisionService.createUpdateStarterRevision({
          ...starterFormValues,
          categories,
          cover_photo: coverPhotoName,
          user_id: this.starter.user_id,
          id: this.starter.id,
        }).pipe(
          mergeMap((result: StarterRevision) => {
            let coverRequest: Observable<undefined> = of();
            if (this.starterRevision) {
              // Move and update the cover photo if the name has changed and the cover photo has changed.
              if (this.starterRevision.cover_photo !== coverPhotoName && coverHasChanged) {
                coverRequest = this.startersService.moveAndUpdateStarterCover(
                  `${this.starterRevision.user_id}/${this.starterRevision.id}/${this.starterRevision.cover_photo}`,
                  `${this.starterRevision.user_id}/${this.starterRevision.id}/${coverPhotoName}`,
                  coverPhotoBase64
                );
              } else if (this.starterRevision.cover_photo !== coverPhotoName) {
                // Move the cover photo if the name has changed.
                coverRequest = this.startersService.moveStarterCover(
                  `${this.starterRevision.user_id}/${this.starterRevision.id}/${this.starterRevision.cover_photo}`,
                  `${this.starterRevision.user_id}/${this.starterRevision.id}/${coverPhotoName}`
                );
              } else if (coverHasChanged) {
                // Update the cover photo if the cover photo has changed.
                coverRequest = this.startersService.upsertStarterCover(
                  `${this.starterRevision.user_id}/${this.starterRevision.id}/${coverPhotoName}`,
                  coverPhotoBase64
                );
              }
            } else if (this.starter) {
              // Update the cover photo if the cover photo has changed.
              coverRequest = this.startersService.upsertStarterCover(
                `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`,
                coverPhotoBase64
              );
            }
            return forkJoin([
              of(result),
              coverRequest
            ]);
          })
        ).subscribe((response: [StarterRevision, undefined]) => {
          this.saveStarterError = '';
          this.starterRevision = response[0];
        }, (error: Error) => {
          this.saveStarterError = error.message;
        });
      } else {
        // If the starter hasn't been live/active, just update the starter.
        this.startersService.updateStarter(this.starter.id, {
          ...starterFormValues,
          categories,
          user_id: this.user.id,
          cover_photo: coverPhotoName
        }).pipe(
          mergeMap((result: Starter) => {
            let coverRequest: Observable<undefined> = of();
            if (this.starter) {
              // Move and update the cover photo if the name has changed and the cover photo has changed.
              if (this.starter.cover_photo !== coverPhotoName && coverHasChanged) {
                coverRequest = this.startersService.moveAndUpdateStarterCover(
                  `${this.starter.user_id}/${this.starter.id}/${this.starter.cover_photo}`,
                  `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`,
                  coverPhotoBase64
                );
              } else if (this.starter.cover_photo !== coverPhotoName) {
                // Move the cover photo if the name has changed.
                coverRequest = this.startersService.moveStarterCover(
                  `${this.starter.user_id}/${this.starter.id}/${this.starter.cover_photo}`,
                  `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`
                );
              } else if (coverHasChanged) {
                // Update the cover photo if the cover photo has changed.
                coverRequest = this.startersService.upsertStarterCover(
                  `${this.starter.user_id}/${this.starter.id}/${coverPhotoName}`,
                  coverPhotoBase64
                );
              }
            }
            this.starter = result;
            return forkJoin([
              of(result),
              coverRequest
            ]);
          })
        ).subscribe((response: [Starter, undefined]) => {
          this.saveStarterError = '';
          this.starter = response[0];
        }, (error: Error) => {
          this.saveStarterError = error.message;
        });
      }
    }
  }

  /**
   * Saves the comment and potentially the status (if updated).
   * @param {Event} event
   */
  saveCommentAndStatus(event: Event): void {
    this.submitted = true;
    if (this.comment.valid && this.starter && this.user) {
      if (this.starterStatus !== this.starter.status) {
        this.startersService.updateStarterStatus(this.starter.id, {
          starter_id: this.starter.id,
          user_id: this.user.id,
          comment: this.comment.value,
          from_status: this.starter.status,
          to_status: this.starterStatus,
        }, this.starterStatus === 'ACTIVE' ? this.starterRevision : undefined)
          .subscribe(([starter, activity]: [Starter, StarterActivity]) => {
            this.submitted = false;
            this.starterActivity.unshift({
              ...activity,
              ...(this.userProfile ? { user: this.userProfile } : {})
            });
            this.updateActivityError = '';
            this.comment.reset();
          }, (error: Error) => {
            this.updateActivityError = error.message;
          });
      } else {
        this.starterActivityService.createActivityForStarter({
          starter_id: this.starter.id,
          user_id: this.user.id,
          comment: this.comment.value
        }).subscribe((activity: StarterActivity) => {
          this.submitted = false;
          this.starterActivity.unshift({
            ...activity,
            ...(this.userProfile ? { user: this.userProfile } : {})
          });
          this.updateActivityError = '';
          this.comment.reset();
        }, (error: Error) => {
          this.updateActivityError = error.message;
        });
      }
    }
  }

  /**
   * Deletes the starter and all its associated data.
   * @param {Event} event
   */
  deleteStarter(): void {
    if (this.starter) {
      this.startersService.deleteStarter(this.starter.id, this.starter?.user_id)
        .subscribe(() => {
          this.router.navigate([`/starters`]);
        }, (error: Error) => {
          this.deleteStarterError = error.message;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}