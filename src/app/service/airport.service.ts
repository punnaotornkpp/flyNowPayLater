import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { MOCK_AIRPORT } from '../../assets/mock';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpService) {}

  getAirport<T>(): Observable<T> {
    const airport = MOCK_AIRPORT;
    // return this.http.get<T>(`${environment.fly}airport`);
    return of(airport as T);
  }
}
