import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { MOCK_AIRPORT } from '../../assets/language/airport';
import { BookingLink } from '../shared/footer/footer.component';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private jsonUrl = 'assets/footer.json';
  constructor(private http: HttpService) {}

  getAirport<T>(): Observable<T> {
    const airport = MOCK_AIRPORT;
    return of(airport as T);
  }

  getBookingLinks(): Observable<{ bookingLinks: BookingLink[] }> {
    return this.http.get<{ bookingLinks: BookingLink[] }>(this.jsonUrl);
  }
}
