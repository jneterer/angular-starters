import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { StarterRevision } from 'contracts/starters/starter';
import { StarterRevisionService } from 'private/shared/services/starter-revision/starter-revision.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarterRevisionResolver implements Resolve<StarterRevision | null> {

  constructor(private starterRevisionService: StarterRevisionService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<StarterRevision | null> {
    return this.starterRevisionService.getStarterRevision(route.params.id);
  }
}
