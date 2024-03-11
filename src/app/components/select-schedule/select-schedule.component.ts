import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { Router } from '@angular/router';
import { FlightSearchForm, JourneySearch } from '../../model/session.model';
import { BookingService } from '../../service/booking.service';
import { IFlight, IJourney } from '../../model/flight-schedule';
import { DateTime } from '../../core/helper/date.helper';
import { SharedService } from '../../service/shared.service';
import { PopupService } from '../../service/popup.service';

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

  redirectNext() {
    this.router.navigateByUrl('passengers');
  }

  handleBackClick(index: number, callback: (status: boolean) => void): void {
    this.handleNewSchedule(index, 1);
    callback(this.status);
  }

  handleNewSchedule(index: number, type: number) {
    /// fix later so confuse
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
    const obs = this.booking.getFlightFare(this.form).subscribe((resp) => {
      this.form.journeys.forEach((journey, index) => {
        journey.departureDate = originalDates[index];
        this.session.set('schedule', resp);
        this.sessionValue = resp as IFlight;
        this.spinner = true;
      });
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
}
