import { Component, OnInit } from '@angular/core';
import { IHeroData } from 'src/app/contracts/components/hero/ihero-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  readonly heroData: IHeroData[] = [
    {
      imgUrl: '../../../assets/undraw_software_engineer_lvl5.svg',
      imgAlt: 'Woman With Access To Many Angular Starters',
      reversed: false,
      title: 'Starters',
      subtitle: 
      `Access Angular starter projects from developers all over the world and get your own projects off the ground and running in minutes in categories like: Headless CMS, MongoDB Stitch, Angular Universal, and so much more!`,
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
      `Begin your project with a well thought out design and pre-built theme using some of the best UI frameworks like: Angular Material, TailwindCSS, Bootstrap, and more!`,
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
      `Browse sites built using one of our starters or themes!`,
      buttonText: 'Explore Sites',
      buttonUrl: '/sites',
      buttonIcon: 'arrow_forwards'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
