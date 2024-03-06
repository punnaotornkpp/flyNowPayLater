import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent extends SubscriptionDestroyer implements OnInit {
  constructor(private route: Router, private session: SessionStorage) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('history');
        console.log(JSON.parse(item as string));
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  redirectPrevious() {
    this.route.navigateByUrl('extras');
  }
}
