import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { StarterActivity } from 'contracts/starters/activity';
import { StarterActivityService } from 'private/shared/services/starter-activity/starter-activity.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarterActivityResolver implements Resolve<StarterActivity[]> {

  constructor(private starterActivityService: StarterActivityService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<StarterActivity[]> {
    return this.starterActivityService.getActivityForStarter(route.params.id);
  }
}
