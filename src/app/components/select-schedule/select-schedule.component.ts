import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-schedule',
  templateUrl: './select-schedule.component.html',
  styleUrl: './select-schedule.component.scss',
})
export class SelectScheduleComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  route = { origin: '', destination: '' };
  check: any;

  constructor(private session: SessionStorage, private router: Router) {
    super();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('data');
        this.check = JSON.parse(item);
        // this.route.origin = item.form!.journeys[0]!.origin;
        // this.route.destination = item.form!.journeys[0]!.destination;
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
