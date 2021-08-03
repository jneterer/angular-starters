import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { ContentService } from 'shared/services/content/content.service';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  session: Session | null = null;
  previousUrl: string = '';
  currentUrl: string = '';

  constructor(
    private router: Router,
    private contentService: ContentService,
    private supabase: SupabaseService,
  ) {
    this.supabase.$session.subscribe((session: Session | null) => {
      this.session = session;
    });
  }

  ngOnInit(): void {
    // Set the previous and current url.
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.contentService.setRouteData({
          previousUrl: this.previousUrl,
          currentUrl: this.currentUrl
        });
      }
    });
  }

}
