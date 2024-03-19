import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { Router } from '@angular/router';
import { FlightSearchForm, JourneySearch } from '../../model/session.model';
import { BookingService } from '../../service/booking.service';
import { IFare, IFlight, IJourney } from '../../model/flight-schedule';
import { DateTime } from '../../core/helper/date.helper';
import { SharedService } from '../../service/shared.service';
import { PopupService } from '../../service/popup.service';
import {
  IFlightFareKey,
  IResponseDetailPricing,
} from '../../model/pricing-detail.model';

@Component({
  selector: 'app-select-schedule',
  templateUrl: './select-schedule.component.html',
  styleUrl: './select-schedule.component.scss',
})
export class SelectScheduleComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  sessionValue!: IFlight;
  spinner: boolean = false;
  form!: FlightSearchForm;
  status: boolean = false;
  defaultDate = '';
  combineItem: IFlightFareKey[] = [];
  securityToken = '';
  loading: boolean = false;

  constructor(
    private session: SessionStorage,
    private router: Router,
    private booking: BookingService,
    private sharedService: SharedService,
    private popup: PopupService
  ) {
    super();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const history = this.session.get('history');
        const schedule = this.session.get('schedule') || '';
        this.form = JSON.parse(history).form as FlightSearchForm;
        if (schedule) {
          const data = JSON.parse(schedule);
          this.sessionValue = data as IFlight;
          this.spinner = true;
          return;
        } else {
          this.getFlightFare();
        }
      } catch (error) {
        this.router.navigateByUrl('');
      }
    }
  }

  redirectPrevious() {
    this.router.navigateByUrl('');
  }

  confirmSchedule() {
    if (this.combineItem.length === this.sessionValue.data.length) {
      if (
        this.sessionValue.data.length === 1 &&
        this.combineItem.length === 1
      ) {
        this.redirectNext();
      }
      if (
        this.combineItem[1] &&
        this.combineItem[0].departureTime &&
        this.combineItem[1].departureTime &&
        new Date(this.combineItem[0].departureTime) <
          new Date(this.combineItem[1].departureTime)
      ) {
        this.redirectNext();
      }
    } else {
      this.popup.waring('You have not yet selected complete schedule flight.');
    }
  }

  redirectNext() {
    const display = JSON.parse(this.session.get('display'));
    if (display) {
      this.session.set('pricing', display);
      this.router.navigateByUrl('passengers');
    } else {
      this.popup.failed('Unable to complete the schedule. Please try again.');
      return;
    }
  }

  handleBackClick(index: number, callback: (status: boolean) => void): void {
    this.handleNewSchedule(index, 1);
    callback(this.status);
  }

  handleNewSchedule(index: number, type: number) {
    let currentJourney = this.form.journeys[index];
    let newDepartureDate = new Date(currentJourney.departureDate);
    let currentDate = new Date();
    let daydiff = newDepartureDate.getDate() - currentDate.getDate();
    if (daydiff > 7) daydiff = 7;
    if (type === 1 && currentDate.getDate() > newDepartureDate.getDate() - 4) {
      this.status = true;
      this.popup.info('Can not select date lower than the current day');
      return;
    }
    if (type === 0) {
      newDepartureDate.setDate(newDepartureDate.getDate() + 7);
    } else if (type === 1) {
      newDepartureDate.setDate(newDepartureDate.getDate() - daydiff);
    }
    let newDepartureDate1;
    if (index > 0 && type === 1) {
      newDepartureDate1 = new Date(this.form.journeys[1].departureDate);
      newDepartureDate1.setDate(newDepartureDate1.getDate() - daydiff);
    }
    currentJourney.departureDate = DateTime.setTimeZone(newDepartureDate);
    if (newDepartureDate1) {
      this.form.journeys[1].departureDate =
        DateTime.setTimeZone(newDepartureDate1);
    }

    this.form.journeys[index] = currentJourney;
    this.session.set('history', { form: this.form });
    this.sharedService.triggerHeaderRefresh();
    this.spinner = false;
    this.getFlightFare();
  }

  getFlightFare() {
    const originalDates = this.checkDateRange();
    const obs = this.booking.getFlightFare(this.form).subscribe({
      next: (resp) => {
        this.form.journeys.forEach((journey, index) => {
          journey.departureDate = originalDates[index];
          this.session.set('schedule', resp);
          this.sessionValue = resp as IFlight;
          this.securityToken = this.sessionValue.securityToken;
          this.spinner = true;
        });
      },
      error: (error) => {
        this.popup.waring('Sorry, something went wrong.');
        console.log(error);
      },
    });
    this.AddSubscription(obs);
  }

  checkDateRange(): string[] {
    const today = new Date();
    const originalDates: string[] = [];
    this.form.journeys.forEach((journey) => {
      const departureDate = new Date(journey.departureDate);
      originalDates.push(journey.departureDate);
      const diffDate = departureDate.getDate() - today.getDate();
      if (diffDate === 0) {
        departureDate.setDate(departureDate.getDate() + 3);
      } else if (diffDate === 1) {
        departureDate.setDate(departureDate.getDate() + 2);
      } else if (diffDate === 2) {
        departureDate.setDate(departureDate.getDate() + 1);
      }
      journey.departureDate = DateTime.setTimeZone(departureDate);
    });
    return originalDates;
  }

  selectFlightFare(item: [IFlightFareKey, string], index: number) {
    this.loading = false;
    if (index >= this.combineItem.length) {
      this.combineItem.length = index + 1;
    }
    this.combineItem[index] = item[0];
    this.combineItem[index].departureTime = new Date(item[1]);
    if (this.combineItem[0] == null) {
      this.popup.info('Please choose your depart trip first.');
      this.loading = false;
      return;
    }
    if (
      this.combineItem[1] &&
      this.combineItem[0].departureTime &&
      this.combineItem[1].departureTime &&
      new Date(this.combineItem[0].departureTime) >=
        new Date(this.combineItem[1].departureTime)
    ) {
      this.popup.waring(
        'The departure date cannot be greater than the return date.'
      );
      this.loading = false;
      return;
    }
    const pricing = {
      flightFareKey: this.combineItem,
      includeExtraServices: false,
    };
    const obs = this.booking
      .getPricingDetail(pricing, this.securityToken)
      .subscribe({
        next: (resp) => {
          this.popup.success('Flight schedule selected complete.');
          this.session.set('display', resp);
          this.session.set('flightFareKey', pricing);
          this.loading = true;
          this.sharedService.triggerHeaderRefresh();
        },
        error: (error) => {
          this.popup.waring(
            'Sorry, something went wrong. , Please select other available flights.'
          );
          console.log(error);
        },
      });
    this.AddSubscription(obs);
  }
}
