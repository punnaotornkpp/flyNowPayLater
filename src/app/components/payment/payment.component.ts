import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { DateTime } from '../../core/helper/date.helper';
import { BookingService } from '../../service/booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IAdult,
  IChildren,
  IDispalyPassenger,
  IInfant,
  IPassengerInfo,
  IPassengers,
} from '../../model/passenger.model';
import { IFlightFareKey } from '../../model/pricing-detail.model';

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
  // form: FormGroup;

  constructor(
    private route: Router,
    private session: SessionStorage,
    private booking: BookingService,
    private fb: FormBuilder
  ) {
    super();
    // this.form = this.fb.group({
    //   policy: ['', Validators.required],
    // });
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const passengers = JSON.parse(this.session.get('passengers'));
        this.passengers = [
          ...passengers.adults.map((p: IAdult[]) => ({ ...p, type: 'Adult' })),
          ...passengers.children.map((p: IChildren[]) => ({
            ...p,
            type: 'Child',
          })),
          ...passengers.infants.map((p: IInfant[]) => ({
            ...p,
            type: 'Infant',
          })),
        ];
        this.preparePassengerInfos();
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  redirectPrevious() {
    this.route.navigateByUrl('extras');
  }

  redirectNext() {
    const securityToken =
      JSON.parse(this.session.get('schedule')).securityToken || '';
    const obs = this.booking
      .SubmitBooking(this.form, securityToken)
      .subscribe((resp) => {
        console.log(resp);
      });
    this.AddSubscription(obs);
  }

  preparePassengerInfos() {
    const flightFareKey = JSON.parse(this.session.get('flightFareKey'));
    let paxNumber = 1;
    this.form.passengerInfos = this.passengers.map((passenger) => {
      const age = this.calculateAge(passenger.birthdayDate);
      const passengerInfo: IPassengerInfo = {
        paxNumber: paxNumber++,
        title: passenger.title,
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        middleName: '',
        age: age,
        dateOfBirth: DateTime.setTimeZone(passenger.birthdayDate),
        passengerType: passenger.type,
        mobilePhone: passenger.mobilePhone || '',
        // email: passenger.email || '',
        gender: this.getGender(passenger.title),
        flightFareKey: flightFareKey.flightFareKey.map(
          (fk: IFlightFareKey) => ({
            fareKey: fk.fareKey,
            journeyKey: fk.journeyKey,
            extraService: [],
            selectedSeat: [],
          })
        ),
      };
      if (passenger.email !== '') {
        passengerInfo.email = passenger.email;
      }
      return passengerInfo;
    });
  }

  getGender(title: string) {
    if (
      title === 'Mr' ||
      title === 'Monk' ||
      title === 'Mstr' ||
      title === 'Boy'
    ) {
      return 'Male';
    } else if (title === 'Mrs' || title === 'Miss' || title === 'Girl') {
      return 'Female';
    } else {
      return 'Unknow';
    }
  }

  calculateAge(dob: Date) {
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }

  setTimeZone(date: Date) {
    return DateTime.setTimeZone(date);
  }
}
