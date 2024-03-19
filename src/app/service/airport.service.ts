import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { MOCK_AIRPORT } from '../../assets/language/airport';
import { IFooter } from '../shared/footer/footer.component';
import { Footer } from '../../assets/language/content';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private jsonUrl = '../../assets/language/content.json';
  constructor(private http: HttpService) {}

  getAirport<T>(): Observable<T> {
    const airport = MOCK_AIRPORT;
    return of(airport as T);
  }

  getFooter<T>(): Observable<T> {
    const footer = Footer;
    return of(footer as T);
  }

  // getBookingLinks(): Observable<IFooter> {
  //   return this.http.get<IFooter>(this.jsonUrl);
  // }
}
