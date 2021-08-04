import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Starter } from 'contracts/starters/starter';
import { StartersService } from 'private/shared/services/starters/starters.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarterResolver implements Resolve<Starter> {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Starter> {
    return this.startersService.getStarter(route.params.id);
  }
}
