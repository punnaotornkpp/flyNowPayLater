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

  constructor(private session: SessionStorage, private router: Router) {
    super();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('data');
        console.log(JSON.parse(item as string));
      } catch (error) {
        this.router.navigateByUrl('');
      }
    }
    this.route.origin = 'DMK';
    this.route.destination = 'CNX';
  }

  redirectPrevious() {
    this.router.navigateByUrl('');
  }
  redirectNext() {
    this.router.navigateByUrl('passengers');
  }
}
