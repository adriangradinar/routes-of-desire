import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Comment} from '@angular/compiler';
import {ErrorObservable} from 'rxjs-compat/observable/ErrorObservable';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {JourneyOverview} from './models/journey-overview';
import {UserOverview} from './models/user-overview';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Handle errors
  private static handleError(err): ErrorObservable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      // this.auth.login();
      console.log('No login present...');
    }
    return ErrorObservable.create(errorMsg);
  }

  constructor(private client: HttpClient) {}

  public getUserJourney(userId, journeyId): Observable<Comment[]> {
    return this.client.post(environment.urlBase + 'getUserJourney', {
      user_id: userId,
      journey_id: journeyId
    }).pipe(
      map(res => res),
      catchError((error) => ApiService.handleError(error))
    );
  }

  public getUserJourneys(userId): Observable<JourneyOverview[]> {
    return this.client.post(environment.urlBase + 'getUserJourneys', {
      user_id: userId
    }).pipe(
      map(res => res),
      catchError((error) => ApiService.handleError(error))
    );
  }

  public getAllUsersAndTotalJourneys(): Observable<UserOverview[]> {
    return this.client.get<UserOverview>(environment.urlBase + 'getUsersData')
      .pipe(
        map(res => res),
        catchError((error) => ApiService.handleError(error))
      );
  }
}
