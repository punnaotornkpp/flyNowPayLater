import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorage {
  get(key: string): string {
    const val = sessionStorage.getItem(key);
    if (!val) {
      throw new Error(`SessionStorage: ${key} is null`);
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
