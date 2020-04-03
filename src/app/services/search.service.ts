import { Injectable } from '@angular/core';
import { StitchAppClient } from 'mongodb-stitch-browser-sdk';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IGlobalSearchResult } from '../contracts/search/iglobal-search-result';
import { ISearchResult } from '../contracts/search/isearch-result';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Client variable to use in the service.
  private readonly client: StitchAppClient;
  // Variable with access to the all data collection.
  private allDataCollection;

  constructor(private clientService: ClientService) {
    // Get the shareable client to use in this service.
    this.client = clientService.getClient;
    // Set the database.
    const mongodb = clientService.getMongoDB;
    // Set the all data collection.
    this.allDataCollection = mongodb.db(environment.startersDB).collection(environment.allDataCollection);
  }

  /**
   * Performs a global search on starters, themes, and sites for the search
   * results page.
   * @param {string} searchTerm 
   * @returns {Observable<IGlobalSearchResult[]>}
   */
  search(searchTerm: string): Observable<IGlobalSearchResult[]> {
    const pipeline = [
      {
        '$searchBeta': {
          'search': {
            'query': searchTerm, 
            'path': [
              'description', 'name'
            ]
          }
        }
      }, {
        '$project': {
          'type': 1, 
          'name': 1, 
          'description': 1, 
          'demo_url': 1,
          'repo_url': 1,
          'score': {
            '$meta': 'searchScore'
          }
        }
      }, {
        '$group': {
          '_id': '$type', 
          'avgScore': {
            '$avg': '$score'
          }, 
          'results': {
            '$push': {
              'name': '$name',
              'description': '$description',
              'demo_url': "$demo_url",
              'repo_url': "$repo_url",
              'score': '$score'
            }
          }
        }
      }
    ];

    return <Observable<IGlobalSearchResult[]>>from(this.allDataCollection.aggregate(pipeline).toArray());
  }

  /**
   * Performs global search on starters, themes, and sites.
   * @param {searchTerm} query 
   * @returns {Observable<IGlobalSearchResult[]>}
   */
  globalSearch(searchTerm: string): Observable<IGlobalSearchResult[]> {
    // Create the pipeline.
    const pipeline = [
      {
        '$searchBeta': {
          'search': {
            'query': searchTerm, 
            'path': [
              'description', 'name'
            ]
          }, 
          'highlight': {
            'path': [
              'name', 'description'
            ]
          }
        }
      }, {
        '$project': {
          'type': 1, 
          'name': 1, 
          'description': 1, 
          'score': {
            '$meta': 'searchScore'
          }, 
          'highlights': {
            '$meta': 'searchHighlights'
          }
        }
      }, {
        '$group': {
          '_id': '$type', 
          'avgScore': {
            '$avg': '$score'
          }, 
          'results': {
            '$push': {
              'name': '$name', 
              'score': '$score', 
              'highlights': '$highlights'
            }
          }
        }
      }
    ];

    // Perform search.
    return from(this.allDataCollection.aggregate(pipeline).toArray())
    .pipe(map((searchResults: IGlobalSearchResult[]) => {
      // Limit the search results in the drop down depending on the number of
      // each type of starter returns.
      switch (searchResults.length) {
        case 3: {
          searchResults = this.sliceHighlights(searchResults, 3);
        };
        case 2: {
          searchResults = this.sliceHighlights(searchResults, 5);
        };
        case 1: {
          searchResults = this.sliceHighlights(searchResults, 10);
        };
        default: {
          searchResults = this.sliceHighlights(searchResults, 3);
        };
      };
      return searchResults;
    }));
  }

  /**
   * Reusable method for slicing the highlighted results in order to limit
   * the number of results depending on how many of each type of starter is
   * returned.
   * @param {IGlobalSearchResult[]} searchResults 
   * @param {number} end 
   * @returns {IGlobalSearchResult[]}
   */
  sliceHighlights(searchResults: IGlobalSearchResult[], end: number): IGlobalSearchResult[] {
    return searchResults.map((searchResult: IGlobalSearchResult) => {
      return {
        ...searchResult,
        results: searchResult.results.map((result: ISearchResult) => {
          result.highlights = result.highlights.slice(0, end);
          return result;
        })
      };
    });
  }

}
