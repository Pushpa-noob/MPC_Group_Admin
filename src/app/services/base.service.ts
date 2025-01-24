import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<T> {

    const headers = this.createHeader('application/json', localStorage.getItem('admin_token')?.toString());
    return this.http.get<T>(url, { headers });
  }

  post<T>(url: string, body: any): Observable<T> {
    let headers = this.createHeader('application/json', localStorage.getItem('admin_token')?.toString());
    return this.http.post<T>(url, body, { headers });
  }

  

  put<T>(url: string, body: any): Observable<T> {

    let headers = this.createHeader('application/json', localStorage.getItem('admin_token')?.toString());
    return this.http.put<T>(url, body, { headers });
  }

  delete<T>(url: string): Observable<T> {

    let headers = this.createHeader('application/json', localStorage.getItem('admin_token')?.toString());
    return this.http.delete<T>(url, { headers });
  }

  private createHeader(contentType: string, authToken?: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', contentType);

    if (authToken) {
      headers = headers.append('Authorization', `Bearer ${authToken}`);
    }

    return headers;
  }
}
