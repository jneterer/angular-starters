import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ETheme } from './contracts/shared/theme';
import { ContentService } from './shared/content/content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-starters';
  starterPage: boolean = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private contentService: ContentService,) { }

  ngOnInit(): void {
    // Subscribe to router events and filter by navigation end events.
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      // If the page is a starter page, setting this boolean variable will control various
      // UI elements in this component.
      const starterPage: boolean = this.route.root.firstChild.snapshot.data.starterPage;
      this.starterPage = starterPage ? starterPage : false;
    });
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
  }

}
