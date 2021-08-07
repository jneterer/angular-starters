import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from 'contracts/user/profile';
import { combineLatest, of, Subject, timer } from 'rxjs';
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
    combineLatest([
      this.supabaseService.$session,
      this.supabaseService.$user,
      this.supabaseService.$userProfile,
    ]).pipe(
      takeUntil(this.unsubscribe),
      delayWhen(([session, user, userProfile]: [Session | null, User | null, UserProfile | null]) => {
        // If there is a session, return a timer that will wait for the session
        // to be initialized in local storage.
        if (!!session && !!user && !!userProfile) {
          this.isRedirecting = true;
          return timer(500);
        }
        return of([session, user, userProfile]);
      }),
    ).subscribe(([session, user, userProfile]: [Session | null, User | null, UserProfile | null]) => {
      if (session && user && userProfile) this.router.navigate(['/app/starters']);
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
