import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { Router } from '@angular/router';
import { FlightSearchForm } from '../../model/session.model';
import { BookingService } from '../../service/booking.service';
import { IFlight } from '../../model/flight-schedule';
import { DateTime } from '../../core/helper/date.helper';

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

  constructor(
    private session: SessionStorage,
    private router: Router,
    private booking: BookingService
  ) {
    super();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const session = this.session.get('history');
        this.form = JSON.parse(session).form as FlightSearchForm;
        console.log(this.form);
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

  handleNextClick(index: number) {
    console.log(index);
    let currentJourney = this.form.journeys[index];
    let newDepartureDate = new Date(currentJourney.departureDate);
    newDepartureDate.setDate(newDepartureDate.getDate() + 7);
    currentJourney.departureDate = DateTime.setTimeZone(newDepartureDate);
    this.form.journeys[index] = currentJourney;
    console.log(this.form);
    // this.spinner = false;
    // this.getFlightFare();
  }

  getFlightFare() {
    const obs = this.booking.getFlightFare(this.form).subscribe((resp) => {
      this.session.set('schedule', resp);
      this.sessionValue = resp as IFlight;
      this.spinner = true;
      console.log(this.sessionValue);
    });
    this.AddSubscription(obs);
  }
}
