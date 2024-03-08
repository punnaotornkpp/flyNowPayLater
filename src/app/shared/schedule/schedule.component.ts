import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() onNextClick = new EventEmitter<any>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  defaultTabIndex: number = 4;

  onTabChange(event: MatTabChangeEvent): void {
    const totalTabs = this.value.length + 2;
    if (event.index === 0) {
      this.onNextClick.emit();
    } else if (event.index === totalTabs - 1) {
      this.onNextClick.emit();
    }
  }
}
