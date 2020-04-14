import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IHeroData } from 'src/app/contracts/components/hero/ihero-data';

@Component({
  selector: 'app-in-development',
  templateUrl: './in-development.component.html',
  styleUrls: ['./in-development.component.scss']
})
export class InDevelopmentComponent implements OnInit {
  hero: IHeroData = {
    imgName: 'v1/undraw_programming_2svr.svg',
    imgAlt: 'Man Programming',
    reversed: false,
    title: 'In Developmnent',
    subtitle: 'is currently in development. Check back frequently for changes or visit our Github repo for more updates!',
    buttonText: 'Github',
    buttonUrl: 'https://github.com/jneterer/angular-starters',
    internal: false,
    buttonIcon: 'launch'
  };

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the title from the route.
    this.route.data.pipe(take(1))
    .subscribe((data: { title: string }) => {
      const pageTitle: string = data.title;
      // Prefix the subtitle with the page title.
      this.hero = {
        ...this.hero,
        subtitle: (pageTitle? pageTitle : 'This page') + ' ' + this.hero.subtitle
      };
    });
  }

}
