import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  header = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.header = this.header.append('content-type', 'application/json');
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.header,
    });
  }

  post<T, B>(url: string, data: T): Observable<B> {
    return this.http.post<B>(url, JSON.stringify(data), {
      headers: this.header,
    });
  }

  patch<T, B>(url: string, data: T): Observable<B> {
    return this.http.patch<B>(url, JSON.stringify(data), {
      headers: this.header,
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.header,
    });
  }

  upload<T, B>(url: string, data: T): Observable<B> {
    return this.http.patch<B>(url, data);
  }

  uploadPost<T, B>(url: string, data: T): Observable<B> {
    return this.http.post<B>(url, data);
  }
}
