import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.scss',
})
export class FlightComponent extends SubscriptionDestroyer implements OnInit {
  constructor() {
    super();
  }
  ngOnInit(): void {}

  openDetailFlight(item: any) {
    console.log('hi', item);
  }
}
