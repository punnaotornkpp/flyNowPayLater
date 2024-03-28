import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>('en');

  setCurrentLanguage(language: string): void {
    this.currentLanguage.next(language);
  }

  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }
}
