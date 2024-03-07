import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IAirport } from '../model/airport.model';
import { environment } from '../../environments/environment';
import { FlightSearchForm } from '../model/session.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpService) {}

  getFlightFare<T>(body: FlightSearchForm): Observable<T> {
    return this.http.post(
      `https://nok-booking-pro-api-oo7c6f.0bujfs.sgp-s1.cloudhub.io/api/v1/available-flight-fare-date-range`,
      body
    );
  }
}
