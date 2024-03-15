import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IAirport } from '../model/airport.model';
import { environment } from '../../environments/environment';
import { FlightSearchForm } from '../model/session.model';
import { IPRICING } from '../model/pricing-detail.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  header = new HttpHeaders();
  client_id = '388023c5e52a4b179464a80c0eb6dcfb';
  client_secret = 'F2F0930159684A76aCeeB37Dba8E4a2D';
  constructor(private http: HttpService, private httpc: HttpClient) {}

  getFlightFare<T>(body: FlightSearchForm): Observable<T> {
    return this.http.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/available-flight-fare-date-range`,
      body
    );
  }

  getPricingDetail(body: IPRICING, securityToken: string): Observable<any> {
    let headers = new HttpHeaders()
      .append('Security-Token', securityToken)
      .append('Content-Type', 'application/json')
      .append('client_id', this.client_id)
      .append('client_secret', this.client_secret);

    return this.httpc.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/pricing-details`,
      body,
      { headers }
    );
  }

  getSSR(body: any, securityToken: string): Observable<any> {
    let headers = new HttpHeaders()
      .append('Security-Token', securityToken)
      .append('Content-Type', 'application/json')
      .append('client_id', this.client_id)
      .append('client_secret', this.client_secret);
    return this.httpc.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/ssr`,
      body,
      { headers }
    );
  }

  getSeat(body: any, securityToken: string): Observable<any> {
    let headers = new HttpHeaders()
      .append('Security-Token', securityToken)
      .append('Content-Type', 'application/json')
      .append('client_id', this.client_id)
      .append('client_secret', this.client_secret);
    return this.httpc.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/seat-map`,
      body,
      { headers }
    );
  }

  SubmitBooking(body: any, securityToken: string): Observable<any> {
    let headers = new HttpHeaders()
      .append('Security-Token', securityToken)
      .append('Content-Type', 'application/json')
      .append('client_id', this.client_id)
      .append('client_secret', this.client_secret);
    return this.httpc.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/submit-hold-booking`,
      body,
      { headers }
    );
  }
}
