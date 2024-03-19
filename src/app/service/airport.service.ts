import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../environments/environment.prod';
// import { MOCK_AIRPORT } from '../../assets/language/airport';
import { IAirport } from '../model/airport.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpService, private translate: TranslateService) {}

  getAirport(): Observable<IAirport[]> {
    const lang = this.translate.currentLang || 'en';
    const path = `../../assets/language/${lang}/airport.json`;
    return this.http.get(path);
  }
}
