import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INotificationPopup } from '../model/notification.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  notification = new Subject<INotificationPopup>();
  $notification = this.notification.asObservable();

  success(message: string): void {
    this.notification.next({ status: 0, message: message });
  }

  failed(message: string): void {
    this.notification.next({ status: 1, message: message });
  }

  waring(message: string): void {
    this.notification.next({ status: 2, message: message });
  }

  info(message: string): void {
    this.notification.next({ status: 3, message: message });
  }
}
