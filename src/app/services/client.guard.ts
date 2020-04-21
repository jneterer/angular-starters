import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  
  constructor(private clientService: ClientService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.clientService.initialized ? of(true)
    : this.clientService.initializeStitch().pipe(
      map((initialized: boolean) => {
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
  
}
