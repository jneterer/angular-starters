import { Injectable } from '@angular/core';
import { StitchAppClient } from 'mongodb-stitch-browser-sdk';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ISearchResult } from '../contracts/search/isearch-result';
import { ClientService } from './client.service';
import { ICategory } from '../contracts/categories/icategory';
import { map } from 'rxjs/operators';
import { IAngularVersion } from '../contracts/angular-versions/iangular-version';

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
  // Holds all the filterable categories and angular versions. We don't need to refresh 
  // this data if we don't have to.
  filterableCategories: ICategory[] = [];
  filterableVersions: {} = {
    starter: [],
    theme: [],
    site: []
  };

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
   * @param {string[]} angularVersionFilters
   * @param {string[]} categoryFilters
   * @returns {Observable<ISearchResult[]>}
   */
  getAllData(type: ('starter' | 'theme' | 'site'), angularVersionFilters: string[], categoryFilters: string[]): Observable<ISearchResult[]> {
    let query = { 
      status: "active",
      type: type
    };
    if (angularVersionFilters || categoryFilters) {
      query['$and'] = [];
      if (angularVersionFilters) {
        let versionFilters: object[] = angularVersionFilters.map((angularVersion: string) => {
          return {
            angular_version: angularVersion
          }
        });
        query['$and'] = query['$and'].concat(versionFilters);
      }
      if (categoryFilters) {
        let catFilters: object[] = categoryFilters.map((category: string) => {
          return {
            categories: category
          }
        });
        query['$and'] = query['$and'].concat(catFilters);
      };
    }
    const options = {
      projection: { _id: 0, status: 0 },
      sort: { name: 1 }
    };
    return <Observable<ISearchResult[]>>from(this.allDataCollection.find(query, options).toArray());
  }

  /**
   * Gets data by type, name, and optionally owner (when type is not site).
   * @param {'starter' | 'theme' | 'site'} type 
   * @param {string} name 
   * @param {string} owner 
   * @returns {Observable<ISearchResult>}
   */
  getData(type: ('starter' | 'theme' | 'site'), name: string, owner?: string): Observable<ISearchResult> {
    let query = { 
      type: type, 
      name: name
    };
    if (owner) {
      query['owner'] = owner;
    }
    const options = {
      projection: { _id: 0, status: 0 }
    };

    return <Observable<ISearchResult>>from(this.allDataCollection.findOne(query, options));
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

    return <Observable<ICategory[]>>from(this.categoriesCollection.find(query, options).toArray())
    .pipe(map((filterableVersions: ICategory[]) => {
      this.filterableCategories = filterableVersions;
      return filterableVersions;
    }));
  }

  /**
   * Gets all angular versions associated with starters, themes, or sites.
   * @param {('starter' | 'theme' | 'site')} type 
   * @returns {Observable<IAngularVersion[]>}
   */
  getVersions(type: ('starter' | 'theme' | 'site')): Observable<IAngularVersion[]> {
    const pipeline: {}[] = [
      {
        '$match': {
          'type': type
        }
      }, {
        '$group': {
          '_id': '$angular_version', 
          'total': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          '_id': 1
        }
      }
    ];
    return <Observable<IAngularVersion[]>>from(this.allDataCollection.aggregate(pipeline).toArray())
    .pipe(map((filterableVersions: {}[]) => {
      this.filterableVersions[type] = filterableVersions;
      return filterableVersions;
    }));
  }

}
