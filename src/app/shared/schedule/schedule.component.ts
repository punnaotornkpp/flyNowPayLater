import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { IFare, IJourney, ISchedule } from '../../model/flight-schedule';
import { SharedService } from '../../service/shared.service';
import { SessionStorage } from '../../core/helper/session.helper';
import { IFlightFareKey } from '../../model/pricing-detail.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent extends SubscriptionDestroyer implements OnInit {
  @Input() value!: IJourney[];
  @Input() currentIndex: number = 0;
  @Input() isSelectedFlight: IFlightFareKey[] = [];
  @Output() onNextClick = new EventEmitter<any>();
  @Output() onBackClick = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<[IFlightFareKey, string]>();

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
    this.findDefaultIndex();
    if (this.value.length < 7) {
      this.empty = true;
    }
  }

  onTabChange(event: MatTabChangeEvent, value: IJourney[]): void {
    if (event.index === 0) {
      this.onBackClick.emit((resp: boolean) => {
        this.empty = resp;
        this.findDefaultIndex();
      });
      return;
    } else if (event.index === this.totalIndex - 1) {
      this.onNextClick.emit();
      return;
    }
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionvalue = JSON.parse(this.session.get('history'));
      sessionvalue.form.journeys[this.currentIndex].departureDate =
        value[event.index - 1].departureDate;
      this.session.set('history', { form: sessionvalue.form });
      this.sharedService.triggerHeaderRefresh();
    }
  }

  findDefaultIndex() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionvalue = JSON.parse(this.session.get('history'));
      const targetDepartureDate =
        sessionvalue.form.journeys[this.currentIndex].departureDate;
      const matchingIndex = this.value.findIndex(
        (element) => element.departureDate === targetDepartureDate
      );
      this.defaultTabIndex = matchingIndex + 1;
    }
  }

  selectFlightFare(key: [IFlightFareKey, number], schedule: ISchedule[]) {
    const item = schedule[key[1]];
    this.onSelect.emit([key[0], item.departureDate]);
  }
}
