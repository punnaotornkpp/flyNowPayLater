import { Injectable } from '@angular/core';
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
  private apiUrl = environment.book;
  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;

  constructor(private http: HttpClient) {}

  private getHeaders(securityToken: string): HttpHeaders {
    return new HttpHeaders()
      .append('Security-Token', securityToken)
      .append('Content-Type', 'application/json')
      .append('client_id', this.clientId)
      .append('client_secret', this.clientSecret);
  }

  getToken(): Observable<any> {
    const headers = new HttpHeaders()
      .append('client_id', this.clientId)
      .append('client_secret', this.clientSecret);
    return this.http.get(`${this.apiUrl}/token`, {
      headers,
    });
  }

  getFlightFare(
    body: FlightSearchForm,
    securityToken: string
  ): Observable<any> {
    const headers = this.getHeaders(securityToken);
    return this.http.post(
      `${this.apiUrl}/available-flight-fare-date-range`,
      body,
      { headers }
    );
  }

  getPricingDetail(body: IPRICING, securityToken: string): Observable<any> {
    const headers = this.getHeaders(securityToken);
    return this.http.post(`${this.apiUrl}/pricing-details`, body, { headers });
  }

  getSSR(body: any, securityToken: string): Observable<any> {
    const headers = this.getHeaders(securityToken);
    return this.http.post(`${this.apiUrl}/ssr`, body, { headers });
  }

  getSeat(body: any, securityToken: string): Observable<any> {
    const headers = this.getHeaders(securityToken);
    return this.http.post(`${this.apiUrl}/seat-map`, body, { headers });
  }

  submitBooking(body: any, securityToken: string): Observable<any> {
    const headers = this.getHeaders(securityToken);
    return this.http.post(`${this.apiUrl}/create-hold-pnr`, body, {
      headers,
    });
  }
}
