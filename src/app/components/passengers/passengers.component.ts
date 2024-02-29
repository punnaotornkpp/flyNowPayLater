import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { Router } from '@angular/router';

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
  constructor(private route: Router) {
    super();
  }

  ngOnInit(): void {}

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
