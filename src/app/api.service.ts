import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/internal/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAccountId(payload): Observable<any> {
    const authToken = sessionStorage.getItem('access_token');
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      }),
    };
    const url = environment.baseUrlInfo;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getAccountId', url)));
  }

  postDocument(payload) {
    const authToken = sessionStorage.getItem('access_token');
    const apiEndpoint = `${environment.baseUrl}/${environment.account_id}/envelopes`;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post(apiEndpoint, payload, httpOptions)
      .pipe(catchError(this.handleError('postDocument', payload)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}
