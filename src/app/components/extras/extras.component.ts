import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss',
})
export class ExtrasComponent extends SubscriptionDestroyer implements OnInit {
  selectedItem: any;
  constructor(private route: Router, private session: SessionStorage) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('data');
        console.log(JSON.parse(item as string));
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  redirectPrevious() {
    this.route.navigateByUrl('passengers');
  }
  redirectNext() {
    this.route.navigateByUrl('payment');
  }

  selectDetail(item: number): void {
    this.selectedItem = item;
  }
}
