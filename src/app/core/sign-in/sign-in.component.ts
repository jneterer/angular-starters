import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { of, Subject, timer } from 'rxjs';
import { delayWhen, takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  isRedirecting: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit(): void {
    this.supabaseService.$session.pipe(
      takeUntil(this.unsubscribe),
      delayWhen((session: Session | null) => {
        // If there is a session, return a timer that will wait for the session
        // to be initialized in local storage.
        if (!!session) {
          this.isRedirecting = true;
          return timer(500);
        }
        return of(null);
      }),
    ).subscribe((session: Session | null) => {
      if (session) this.router.navigate(['/app/dashboard']);
    });
  }

  /**
   * Logs the user in.
   * @param {MouseEvent} event
   */
  handleLogin(event: MouseEvent): void {
    this.supabaseService.signIn().subscribe(
      () => { },
      (error: Error) => {
        console.log('error: ', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
