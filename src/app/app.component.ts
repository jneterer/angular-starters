import { Component, OnInit } from '@angular/core';
import { ETheme } from './contracts/shared/theme';
import { ContentService } from './shared/content/content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-starters';

  constructor(private contentService: ContentService) { }

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
  }

}
