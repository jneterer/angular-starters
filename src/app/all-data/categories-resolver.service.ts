import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StartersService } from '../services/starters.service';
import { ICategory } from '../contracts/categories/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesResolverService implements Resolve<any> {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategory[]> {
    return this.startersService.getCategories();
  }

}
