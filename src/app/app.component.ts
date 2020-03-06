import { Component, OnInit } from '@angular/core';
import { ContentService } from './shared/content/content.service';
import { ETheme } from './contracts/shared/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-starters';
  theme: ETheme;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.theme$.subscribe((theme: ETheme) => this.theme = theme);
  }

}
