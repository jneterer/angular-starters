import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteData } from 'contracts/general/route-data';
import { UserProfile } from 'contracts/user/profile';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentService } from 'shared/services/content/content.service';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit, OnDestroy {
  menuOpen: boolean = false;
  userProfile: UserProfile | null = null;
  currentUrl: string = '';
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private supabaseService: SupabaseService,
    private contentService: ContentService
  ) { }

  ngOnInit(): void {
    this.supabaseService.$userProfile.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((userProfile: UserProfile | null) => this.userProfile = userProfile);
    this.contentService.$routeData.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(({ currentUrl }: RouteData) => {
      this.currentUrl = currentUrl;
      this.menuOpen = false;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
