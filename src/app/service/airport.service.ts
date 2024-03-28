import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IAirport } from '../model/airport.model';
import { HttpClient } from '@angular/common/http';
import { IFooter } from '../shared/footer/footer.component';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpClient, private translate: TranslateService) {}

  getAirport(): Observable<IAirport[]> {
    const lang = this.translate.currentLang || 'en';
    const path = `../../assets/language/${lang}/airport.json`;
    return this.http.get<IAirport[]>(path);
  }

  getFooter(): Observable<IFooter> {
    const lang = this.translate.currentLang || 'en';
    const path = `../../assets/language/${lang}/content.json`;
    return this.http.get<IFooter>(path);
  }
}
