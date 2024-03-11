import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { IJourney } from '../../model/flight-schedule';
import { SharedService } from '../../service/shared.service';
import { SessionStorage } from '../../core/helper/session.helper';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent extends SubscriptionDestroyer implements OnInit {
  @Input() value!: IJourney[];
  @Input() currentIndex: number = 0;
  @Output() onNextClick = new EventEmitter<any>();
  @Output() onBackClick = new EventEmitter<any>();
  empty = false;
  defaultTabIndex: number = 4;
  totalIndex: number = 9;

  constructor(
    private sharedService: SharedService,
    private session: SessionStorage
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.value.length < 7) {
      this.empty = true;
    }
  }

  onTabChange(event: MatTabChangeEvent, value: IJourney[]): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionvalue = JSON.parse(this.session.get('history'));
      sessionvalue.form.journeys[this.currentIndex].departureDate =
        value[event.index - 1].departureDate;
      this.session.set('history', { form: sessionvalue.form });
      this.sharedService.triggerHeaderRefresh();
    }

    if (event.index === 0) {
      this.onBackClick.emit((resp: boolean) => {
        this.empty = resp;
        this.defaultTabIndex = 1;
      });
    } else if (event.index === this.totalIndex - 1) {
      this.onNextClick.emit();
    }
  }
}
