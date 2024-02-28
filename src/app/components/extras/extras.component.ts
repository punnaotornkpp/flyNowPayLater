import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss',
})
export class ExtrasComponent extends SubscriptionDestroyer implements OnInit {
  selectedItem: any;
  constructor(private route: Router) {
    super();
  }

  ngOnInit(): void {}

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
