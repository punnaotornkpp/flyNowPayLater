import { Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { IJourney } from '../../model/flight-schedule';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent extends SubscriptionDestroyer implements OnInit {
  @Input() value!: IJourney[];

  constructor() {
    super();
  }

  ngOnInit(): void {}

  defaultTabIndex: number = 4;

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0 || event.index === 8) {
      window.location.reload();
    }
  }
}
