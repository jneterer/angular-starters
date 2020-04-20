import { Component, OnInit } from '@angular/core';
import { IHeroData } from '../../contracts/components/hero/ihero-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  readonly heroData: IHeroData[] = [
    {
      imgName: 'v1/undraw_software_engineer_lvl5.svg',
      imgAlt: 'Woman With Access To Many Angular Starters',
      reversed: false,
      title: 'Starters',
      subtitle: 
      `Find Angular starter projects built for Headless CMS, Userbase, MongoDB Stitch, Angular Universal, and so much more!`,
      buttonText: 'Explore Starters',
      buttonUrl: '/starters',
      internal: true,
      buttonIcon: 'arrow_forwards',
      location: 'Home - Hero'
    },
    {
      imgName: 'v1/undraw_mobile_wireframe_euf4.svg',
      imgAlt: 'Woman and Man Presenting Responsive Wireframes for Website',
      reversed: true,
      title: 'Themes',
      subtitle: 
      `Choose from an amazing collection of pre-built themed Angular projects using some of the best UI frameworks like Angular Material, TailwindCSS, Bootstrap, and more!`,
      buttonText: 'Explore Themes',
      buttonUrl: '/themes',
      internal: true,
      buttonIcon: 'arrow_forwards',
      location: 'Home - Hero',
    },
    {
      imgName: 'v1/undraw_done_a34v.svg',
      imgAlt: 'Man Showing His Built Site',
      reversed: false,
      title: 'Sites',
      subtitle: 
      `Browse featured sites built using a starter or themed project!`,
      buttonText: 'Explore Sites',
      buttonUrl: '/sites',
      internal: true,
      buttonIcon: 'arrow_forwards',
      location: 'Home - Hero'
    }
  ];

  constructor() { }

  ngOnInit(): void { }

}
