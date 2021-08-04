import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { GITHUB_PREFIX } from 'constants/prefixes';
import { Starter } from 'contracts/starters/starter';
import { environment } from 'environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-starters',
  templateUrl: './starters.component.html',
  styleUrls: ['./starters.component.scss']
})
export class StartersComponent implements OnInit, OnDestroy {
  starters: Starter[] = [];
  GITHUB_PREFIX: string = GITHUB_PREFIX;
  starterCoverBucket: string = environment.starterCoverBucket;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(({ starters }: Data) => {
      this.starters = starters;
    });
  }

  /**
   * Signs the user out.
   * @param {MouseEvent} event
   */
  signOut(event: MouseEvent): void {
    this.supabaseService.signOut().subscribe(() => { }, () => { }, () => {
      this.router.navigate(['/sign-in']);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
