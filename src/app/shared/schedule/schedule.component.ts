import { Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { Journey } from '../../model/session.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent extends SubscriptionDestroyer implements OnInit {
  @Input() value!: Journey;

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.value);
  }

  defaultTabIndex: number = 4;

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0 || event.index === 8) {
      window.location.reload();
    }
  }
}
