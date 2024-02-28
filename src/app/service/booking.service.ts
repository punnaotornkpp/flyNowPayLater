import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IAirport } from '../model/airport.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpService) {}

  getFlightFare<T>(body: string[]): Observable<T> {
    return this.http.post(`${environment.book}v1/flight-fare`, body);
  }
}
