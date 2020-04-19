import { Directive, HostListener, Input } from '@angular/core';

export interface ILink {
  type: ('internal' | 'external');
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
    try {
      (<any>window).gtag('event', this.option.type === 'internal' ? 'Internal Link Click' : 'Outbound Link Click', {
        'event_category': this.option.location,
        'event_label': this.option.type === 'internal' ? this.routerLink : this.href,
      })
    } catch(error) {
      // Running locally without google analytics.
    }
  }

}