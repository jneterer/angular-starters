import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ICategory } from '../contracts/categories/icategory';
import { StartersService } from '../services/starters.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesResolverService implements Resolve<any> {

  constructor(private startersService: StartersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategory[]> {
    const filterableCategories: ICategory[] = this.startersService.filterableCategories;
    return filterableCategories.length > 0 ? of(filterableCategories) : this.startersService.getCategories();
  }

}
