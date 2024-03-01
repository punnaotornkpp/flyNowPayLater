import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { Router } from '@angular/router';
import { SessionStorage } from '../../core/helper/session.helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  form: FormGroup;

  constructor(
    private route: Router,
    private session: SessionStorage,
    private fb: FormBuilder
  ) {
    super();
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('data');
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
