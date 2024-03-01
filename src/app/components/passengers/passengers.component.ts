import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { Router } from '@angular/router';
import { SessionStorage } from '../../core/helper/session.helper';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrl: './passengers.component.scss',
})
export class PassengersComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  step = 0;
  constructor(private route: Router, private session: SessionStorage) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('data');
        console.log(JSON.parse(item as string));
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  redirectPrevious() {
    this.route.navigateByUrl('select');
  }

  redirectNext() {
    this.route.navigateByUrl('extras');
  }
}
