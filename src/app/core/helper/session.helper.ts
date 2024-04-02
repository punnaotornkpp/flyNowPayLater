import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorage {
  get(key: string): any {
    const val = sessionStorage.getItem(key);
    if (!val) {
      return '';
    } else {
      return val;
    }
  }

  set<T>(key: string, value: T): void {
    const json = JSON.stringify(value);
    sessionStorage.setItem(key, json);
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
