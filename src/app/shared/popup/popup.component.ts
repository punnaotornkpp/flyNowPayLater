import { Component, OnInit } from '@angular/core';
import { INotificationPopup } from '../../model/notification.model';
import { PopupService } from '../../service/popup.service';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent extends SubscriptionDestroyer {
  notification: INotificationPopup[] = [];

  constructor(popup: PopupService) {
    super();
    const obs = popup.notification.subscribe((notification) => {
      this.notification.push(notification);
      setTimeout(() => {
        this.notification.shift();
      }, 2000);
    });
    this.AddSubscription(obs);
  }

  remove(popup: INotificationPopup) {
    this.notification.splice(this.notification.indexOf(popup), 1);
  }
}
