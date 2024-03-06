import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  header = new HttpHeaders();

  client_id = '8cc36b34120e43cbad3b4ac3c5b3f37c';
  client_secret = '4de6c9f8f7874Bd582BE9Aac31E45009';

  constructor(private http: HttpClient) {
    this.header = this.header.append('content-type', 'application/json');
    this.header = this.header.append('client_id', this.client_id);
    this.header = this.header.append('client_secret', this.client_secret);
    this.header = this.header.append('Security-Token', '');
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
