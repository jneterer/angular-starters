import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Starter } from 'contracts/starters/starter';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StartersService } from 'shared/services/starters/starters.service';

@Injectable({
  providedIn: 'root'
})
export class StarterResolver implements Resolve<Starter | null> {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Starter | null> {
    return this.startersService.getStarter(route.params.id)
      .pipe(
        catchError(() => of(null))
      );
  }
}
