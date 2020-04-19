import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  /**
   * Sends an event to google analytics.
   * @param {string} action 
   * @param {string} category 
   * @param {string} label 
   */
  sendEvent(action: string, category: string, label: string): void {
    let payload: object = {};
    if (category) {
      payload['event_category'] = category;
    }
    if (label) {
      payload['event_label'] = label;
    }
    try {
      (<any>window).gtag('event', action, payload);
    } catch(error) {
      // Running locally without google analytics.
    }
  }

}
