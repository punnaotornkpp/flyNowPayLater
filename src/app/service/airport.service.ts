import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IAirport } from '../model/airport.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpService) {}

  getAirport<T>(): Observable<T> {
    return this.http.get<T>(`${environment.fly}airport`);
  }
}
