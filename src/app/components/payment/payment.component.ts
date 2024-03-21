import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { DateTime } from '../../core/helper/date.helper';
import { BookingService } from '../../service/booking.service';
import {
  IAdult,
  IChildren,
  IDispalyPassenger,
  IInfant,
  IPassengerInfo,
} from '../../model/passenger.model';
import { IFlightFareKey } from '../../model/pricing-detail.model';
import { PopupService } from '../../service/popup.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent extends SubscriptionDestroyer implements OnInit {
  form = {
    actionType: 'create',
    paymentMethod: '',
    passengerInfos: [{}],
  };
  passengers: IDispalyPassenger[] = [];
  loading: boolean = false;
  spinner: boolean = true;
  activePanel: string = '';

  constructor(
    private route: Router,
    private session: SessionStorage,
    private booking: BookingService,
    private popup: PopupService
  ) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        this.form = JSON.parse(this.session.get('formSubmit'));
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  setPaymentMethod(method: string) {
    this.loading = true;
    this.activePanel = method;
    this.form.paymentMethod = method;
  }

  redirectPrevious() {
    this.route.navigateByUrl('extras');
  }

  redirectNext() {
    this.form.actionType = 'create';
    const securityToken =
      JSON.parse(this.session.get('schedule')).securityToken || '';
    if (!this.form.paymentMethod) {
      this.popup.info('Please select payment before submit');
      return;
    }
    this.spinner = false;
    this.loading = false;
    const obs = this.booking.SubmitBooking(this.form, securityToken).subscribe({
      next: (response) => {
        this.popup.success('You have finished submit data booking.');
        this.loading = true;
        this.spinner = true;
        const navigationExtras: NavigationExtras = {
          state: {
            data: response,
          },
        };
        this.route.navigateByUrl('/payment/complate', navigationExtras);
      },
      error: (error) => {
        this.loading = true;
        this.spinner = true;
        this.popup.waring('Sorry, something went wrong.');
        console.log(error);
      },
    });
    this.AddSubscription(obs);
  }

  setTimeZone(date: Date) {
    return DateTime.setTimeZone(date);
  }
}
