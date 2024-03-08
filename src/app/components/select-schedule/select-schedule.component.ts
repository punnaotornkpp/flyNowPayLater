import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { Router } from '@angular/router';
import { FlightSearchForm } from '../../model/session.model';
import { BookingService } from '../../service/booking.service';
import { IFlight } from '../../model/flight-schedule';
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
        const session = this.session.get('history');
        this.form = JSON.parse(session).form as FlightSearchForm;
        this.getFlightFare();
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
    const obs = this.booking.getFlightFare(this.form).subscribe((resp) => {
      this.session.set('schedule', resp);
      this.sessionValue = resp as IFlight;
      this.spinner = true;
    });
    this.AddSubscription(obs);
  }
}
