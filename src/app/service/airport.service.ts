import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { MOCK_AIRPORT } from '../../assets/language/airport-en';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpService) {}

  getAirport<T>(): Observable<T> {
    const airport = MOCK_AIRPORT;
    return of(airport as T);
  }
}
