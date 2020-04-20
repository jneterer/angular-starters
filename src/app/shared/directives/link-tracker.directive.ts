import { Directive, HostListener, Input } from '@angular/core';

export interface ILink {
  type: ('internal' | 'external' | 'mailto');
  location: ('Header');
};

@Directive({
  selector: '[linkTracker]',
  jit: true
})
export class LinkTrackerDirective {

  @Input('linkTracker') option: ILink;
  @Input('routerLink') routerLink: string;
  @Input('href') href: string;

  @HostListener('click', ['$event']) onClick(event) {
    let type: string = '';
    if (this.option.type === 'internal') {
      type = 'Internal Link Click';
    } else if (this.option.type === 'external') {
      type = 'Outbound Link Click';
    } else {
      type = 'Mailto Link Click'
    }
    try {
      (<any>window).gtag('event', type, {
        'event_category': this.option.location,
        'event_label': this.option.type === 'internal' ? this.routerLink : this.href,
      })
    } catch(error) {
      // Running locally without google analytics.
    }
  }

}