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
  items = [
    { id: 1, content: 'Content for item 1' },
    { id: 2, content: 'Content for item 2' },
    { id: 3, content: 'Content for item 3' },
    { id: 4, content: 'Content for item 4' },
    { id: 5, content: 'Content for item 5' },
    { id: 6, content: 'Content for item 6' },
  ];
  selectedItem: { id: number; content: string } | undefined;

  constructor(private route: Router, private session: SessionStorage) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('data');
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

  selectDetail(itemId: number): void {
    this.selectedItem = this.items.find((item) => item.id === itemId);
  }
}
