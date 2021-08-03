import { Injectable } from '@angular/core';
import { RouteData } from 'contracts/general/route-data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private routeData: BehaviorSubject<RouteData> = new BehaviorSubject<RouteData>({
    currentUrl: '',
    previousUrl: ''
  });
  public $routeData: Observable<RouteData> = this.routeData.asObservable();

  constructor() { }

  /**
   * Sets the previous and current url.
   * @param {RouteData} routeData 
   */
  setRouteData(routeData: RouteData): void {
    this.routeData.next(routeData);
  }

}
