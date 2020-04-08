import { Injectable } from '@angular/core';
import { StitchAppClient } from 'mongodb-stitch-browser-sdk';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ISearchResult } from '../contracts/search/isearch-result';
import { ClientService } from './client.service';
import { ICategory } from '../contracts/categories/icategory';

@Injectable({
  providedIn: 'root'
})
export class StartersService {
  // Client variable to use in the service.
  private readonly client: StitchAppClient;
  // Variable with access to the all data collection.
  private allDataCollection;
  // Variable with access to the categories collection.
  private categoriesCollection;

  constructor(private clientService: ClientService) {
    // Get the shareable client to use in this service.
    this.client = clientService.getClient;
    // Set the database.
    const mongodb = clientService.getMongoDB;
    // Set the all data collection.
    this.allDataCollection = mongodb.db(environment.startersDB).collection(environment.allDataCollection);
    // Set the collections collection.
    this.categoriesCollection = mongodb.db(environment.startersDB).collection(environment.categoriesCollection);
  }

  /**
   * Gets all data associated with starters, themes, or sites.
   * Filters based on categories and version.
   * @param {('starter' | 'theme' | 'site')} type 
   * @param {string[]} categoryFilters
   * @returns {Observable<ISearchResult[]>}
   */
  getData(type: ('starter' | 'theme' | 'site'), categoryFilters: string[]): Observable<ISearchResult[]> {
    let query = { 
      status: "active",
      type: type,
    };
    if (categoryFilters) {
      query['$and'] = categoryFilters.map((category: string) => {
        return {
          categories: category
        }
      });
    };
    const options = {
      projection: { _id: 0, status: 0 },
      sort: { name: 1 }
    };

    return <Observable<ISearchResult[]>>from(this.allDataCollection.find(query, options).toArray());
  }

  /**
   * Gets all categories for the starters.
   * @returns {Observable<ICategory[]>}
   */
  getCategories(): Observable<ICategory[]> {
    const query = { status: "active" };
    const options = {
      projection: { _id: 0, status: 0 },
      sort: { name: 1 }
    };

    return <Observable<ICategory[]>>from(this.categoriesCollection.find(query, options).toArray());
  }

}
