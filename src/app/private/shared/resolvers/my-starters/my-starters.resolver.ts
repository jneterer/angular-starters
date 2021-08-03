import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Starter } from 'contracts/starters/starter';
import { StartersService } from 'private/shared/services/starters/starters.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyStartersResolver implements Resolve<Starter[]> {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Starter[]> {
    return this.startersService.getMyStarters();
  }
}
