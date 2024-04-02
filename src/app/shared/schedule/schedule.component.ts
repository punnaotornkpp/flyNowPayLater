import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { IJourney, ISchedule } from '../../model/flight-schedule';
import { SharedService } from '../../service/shared.service';
import { SessionStorage } from '../../core/helper/session.helper';
import { IFlightFareKey } from '../../model/pricing-detail.model';
import { IFareSelectionEvent, ISelectEvent } from '../../model/event.model';

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
  @Output() onSelect = new EventEmitter<IFareSelectionEvent>();

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
    this.empty = this.value.length < 7;
  }

  onTabChange(event: MatTabChangeEvent, value: IJourney[]): void {
    switch (event.index) {
      case 0:
        this.onBackClick.emit((resp: boolean) => {
          this.empty = resp;
          this.findDefaultIndex();
        });
        break;
      case this.totalIndex - 1:
        this.onNextClick.emit();
        break;
      default:
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const sessionvalue = this.session.parseSessionData('history');
          sessionvalue.form.journeys[this.currentIndex].departureDate =
            value[event.index - 1].departureDate;
          this.session.set('history', { form: sessionvalue.form });
          this.sharedService.triggerHeaderRefresh();
        }
        break;
    }
  }

  findDefaultIndex() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionvalue = this.session.parseSessionData('history');
      const targetDepartureDate =
        sessionvalue.form.journeys[this.currentIndex].departureDate;
      const matchingIndex = this.value.findIndex(
        (element) => element.departureDate === targetDepartureDate
      );
      this.defaultTabIndex = matchingIndex + 1;
    }
  }

  selectFlightFare(key: ISelectEvent, schedule: ISchedule[]) {
    const item = schedule[key.selectedItem];
    this.onSelect.emit({
      fareKey: key.setItem,
      departureDate: item.departureDate,
    });
  }
}
