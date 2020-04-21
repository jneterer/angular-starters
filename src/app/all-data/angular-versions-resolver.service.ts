import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IAngularVersion } from '../contracts/angular-versions/iangular-version';
import { StartersService } from '../services/starters.service';

@Injectable({
  providedIn: 'root'
})
export class AngularVersionsResolverService implements Resolve<any>  {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAngularVersion[]> {
    if (state.url.startsWith('/starter')) {
      const filterableVersion: IAngularVersion[] = this.startersService.filterableVersions['starter'];
      return filterableVersion.length > 0 ? of(filterableVersion) : this.startersService.getVersions('starter');
    } else if (state.url.startsWith('/theme')) {
      const filterableVersion: IAngularVersion[] = this.startersService.filterableVersions['theme'];
      return filterableVersion.length > 0 ? of(filterableVersion) : this.startersService.getVersions('theme');
    }
    const filterableVersion: IAngularVersion[] = this.startersService.filterableVersions['site'];
    return filterableVersion.length > 0 ? of(filterableVersion) : this.startersService.getVersions('site');
  }

}
