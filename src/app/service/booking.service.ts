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
  constructor(private http: HttpService) {}

  getFlightFare<T>(body: FlightSearchForm): Observable<T> {
    return this.http.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/available-flight-fare-date-range`,
      body
    );
  }

  getPricingDetail<T>(body: IPRICING, securityToken: string): Observable<T> {
    this.header.append('Security-Token', securityToken);
    return this.http.post(
      `https://nok-booking-exp-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/v1/pricing-details`,
      body
    );
  }
}
