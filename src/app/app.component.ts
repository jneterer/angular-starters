import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ETheme } from './contracts/shared/theme';
import { ContentService } from './shared/content/content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-starters';
  navigationCounter: number = 0;

  constructor(private router: Router,
              private contentService: ContentService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.theme$.subscribe((theme: ETheme) => {
      let body = document.body;
      // Set the theme to dark or light.
      if (theme === ETheme.Dark) {
        if (!body.classList.contains('dark-theme')) {
          body.classList.add('dark-theme');
        }
      } else {
        if (body.classList.contains('dark-theme')) {
          body.classList.remove('dark-theme');
        }
      }
    });
    // Send pageview event to google on navigation, but skip the first since it is already
    // tracked on page load.
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (this.navigationCounter > 0) {
        try {
          (<any>window).gtag('config', environment.gaId, {
            'page_path': event.url
          });
        } catch(error) {
          // Running locally without google analytics.
        }
      }
      this.navigationCounter = this.navigationCounter+1;
    })
  }

}
