import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_AIRPORT } from '../../assets/language/airport';
import { Footer } from '../../assets/language/content';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor() {}

  getAirport<T>(): Observable<T> {
    const airport = MOCK_AIRPORT;
    return of(airport as T);
  }

  getFooter<T>(): Observable<T> {
    const footer = Footer;
    return of(footer as T);
  }
}
