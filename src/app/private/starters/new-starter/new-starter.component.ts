import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Starter } from 'contracts/starters/starter';
import { StarterForm } from 'private/shared/components/starter-form/starter-form.component';
import { StartersService } from 'private/shared/services/starters/starters.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-new-starter',
  templateUrl: './new-starter.component.html',
  styleUrls: ['./new-starter.component.scss']
})
export class NewStarterComponent implements OnInit, OnDestroy {
  user: User | null = null;
  saveStarterError: string = '';
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private startersService: StartersService,
  ) { }

  ngOnInit(): void {
    this.supabaseService.$user.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((user: User | null) => this.user = user);
  }

  /**
   * Creates a new starter.
   * @param {Event} event
   */
  submitNewStarter([{ cover_photo, categories, ...starterFormValues }]: [StarterForm, boolean]): void {
    if (this.user) {
      const imgType: string = cover_photo.substring("data:image/".length, cover_photo.indexOf(";base64"))
      this.startersService.createStarter({
        ...starterFormValues,
        categories: categories.split(', '),
        user_id: this.user.id,
        cover_photo: `${starterFormValues.starter_name}.${imgType}`
      }, cover_photo.split(',')[1])
        .subscribe((result: Starter | null) => {
          if (result) {
            this.router.navigate(['/app/starters/', result.id]);
          } else {
            this.router.navigate(['/app/starters/']);
          }
        }, (error: Error) => {
          this.saveStarterError = error.message;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
