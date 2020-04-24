import { Injectable } from '@angular/core';
import { AnonymousCredential, RemoteMongoClient, Stitch, StitchAppClient, StitchUser } from 'mongodb-stitch-browser-sdk';
import { environment } from '../../environments/environment';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  // Client variable to use in multiple services.
  protected readonly client: StitchAppClient = Stitch.initializeDefaultAppClient(environment.stitchClientName);
  // MongoDB variable used for accessing collections from a database.
  protected readonly mongodb: RemoteMongoClient = this.client.getServiceClient(RemoteMongoClient.factory, environment.stitchServiceName);
  // Boolean variable that holds whether the app has been initialized or not.
  initialized: boolean = false;

  /**
   * Initializes the stitch application.
   * @returns {Observable<boolean>}
   */
  initializeStitch(): Observable<boolean> {
    return from(Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential()))
    .pipe(
      map((user: StitchUser) => {
        this.initialized = true;
        return true;
      }), catchError((error) => {
        return of(false);
      })
    );
  }

  /**
   * Make the client variable shareable.
   * @returns {StitchAppClient}
   */
  get getClient(): StitchAppClient {
    return this.client;
  }

  /**
   * Make the mongodb variable shareable.
   * @returns {RemoteMongoClient}
   */
  get getMongoDB(): RemoteMongoClient {
    return this.mongodb;
  }

  /**
   * Subscribes the user to our email.
   * @param {string} email 
   * @param {string} name 
   * @returns {Observable<{statusCode: number}>}
   */
  subscribe(email: string, name: string): Observable<{statusCode: number}> {
    return from(this.client.callFunction('subscribe_signup', [email, name]));
  }
  
}