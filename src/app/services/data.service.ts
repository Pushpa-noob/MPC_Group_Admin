import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment.prod';



@Injectable({
  providedIn: 'root'
})

export class DataService {
    matchOddsUrl: string = 'https://www.freedomains.email/api/MatchOdds/GetOddslite/4/';
    bookMakerUrl: string = 'https://funfairexch.com/api/MatchOdds/GetOddslite/4/';
  
    /** Oliver Endpoints */
    getEventDetail: string = "https://alp.playunlimited9.co.in/api/v2/competition/getEventDetail/";
    constructor(private baseService: BaseService, private http: HttpClient) { }
     
    fetchEventDetail(eventId: string): Observable<any> {
        const url = `${this.getEventDetail}${eventId}`;
        return this.http.get(url);
      }
    
    
    
      fetchCompleteEventDetail(eventId: string, intervalMs: number): Observable<any> {
        return interval(intervalMs).pipe(
          mergeMap(() => this.fetchEventDetail(eventId)),
          // Filter out null data
          filter(data => data !== null)
        );
      }
  
    fetchMarketRates(apiUrl:string): Observable<any> {
      return this.http.get<any>(apiUrl);
    }
  }