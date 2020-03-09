import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITheme } from 'src/app/contracts/shared/theme';
import { IHeroData } from '../../contracts/components/hero/ihero-data';
import { ContentService } from '../../shared/content/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private unsubscribe: Subject<any> = new Subject<any>();
  readonly heroData: IHeroData[] = [
    {
      imgUrl: '../../../assets/undraw_software_engineer_lvl5.svg',
      imgAlt: 'Woman With Access To Many Angular Starters',
      reversed: false,
      title: 'Starters',
      subtitle: 
      `Find Angular starter projects built for Headless CMS, Userbase, MongoDB Stitch, Angular Universal, and so much more!`,
      buttonText: 'Explore Starters',
      buttonUrl: '/starters',
      buttonIcon: 'arrow_forwards'
    },
    {
      imgUrl: '../../../assets/undraw_mobile_wireframe_euf4.svg',
      imgAlt: 'Woman and Man Presenting Responsive Wireframes for Website',
      reversed: true,
      title: 'Themes',
      subtitle: 
      `Choose from an amazing collection of pre-built themed Angular projects using some of the best UI frameworks like Angular Material, TailwindCSS, Bootstrap, and more!`,
      buttonText: 'Explore Themes',
      buttonUrl: '/themes',
      buttonIcon: 'arrow_forwards'
    },
    {
      imgUrl: '../../../assets/undraw_done_a34v.svg',
      imgAlt: 'Man Showing His Built Site',
      reversed: false,
      title: 'Sites',
      subtitle: 
      `Browse featured sites built using a starter or themed project!`,
      buttonText: 'Explore Sites',
      buttonUrl: '/sites',
      buttonIcon: 'arrow_forwards'
    }
  ];
  currentTheme: ITheme;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.currentThemeConfig$.pipe(takeUntil(this.unsubscribe)).subscribe((theme: ITheme) => this.currentTheme = theme);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
