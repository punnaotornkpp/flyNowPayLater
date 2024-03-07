import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { Router } from '@angular/router';
import { FlightSearchForm } from '../../model/session.model';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-select-schedule',
  templateUrl: './select-schedule.component.html',
  styleUrl: './select-schedule.component.scss',
})
export class SelectScheduleComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  sessionValue!: FlightSearchForm;
  spinner: boolean = false;

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
        const item = this.session.get('history');
        this.sessionValue = JSON.parse(item).form as FlightSearchForm;
        const obs = this.booking
          .getFlightFare(JSON.parse(item).form)
          .subscribe((resp) => {
            this.spinner = true;
          });
        this.AddSubscription(obs);
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
}
