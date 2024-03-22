import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { Router } from '@angular/router';
import { SessionStorage } from '../../core/helper/session.helper';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FlightSearchForm } from '../../model/session.model';
import { PopupService } from '../../service/popup.service';
import { ageValidator } from '../../core/helper/ageValidate.helper';
import { setControl, setControls } from '../../core/helper/form.helper';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrl: './passengers.component.scss',
})
export class PassengersComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  sessionValue!: FlightSearchForm;
  form: FormGroup;
  openPanels: boolean[] = [];

  constructor(
    private route: Router,
    private session: SessionStorage,
    private fb: FormBuilder,
    private popup: PopupService
  ) {
    super();
    this.form = this.fb.group({
      adults: this.fb.array([]),
      children: this.fb.array([]),
      infants: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('history');
        const passenger = JSON.parse(this.session.get('passengers'));
        this.sessionValue = JSON.parse(item).form as FlightSearchForm;

        if (passenger) {
          const setPassengers = passenger;
          setControl(setPassengers, this.form, this.fb);
        } else {
          this.populateFormArrays(this.sessionValue);
        }
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  populateFormArrays(data: FlightSearchForm) {
    for (let i = 0; i < data.adult; i++) {
      this.addAdult();
      this.openPanels.push(true);
    }
    for (let i = 0; i < data.child; i++) {
      this.addChild();
      this.openPanels.push(true);
    }
    for (let i = 0; i < data.infant; i++) {
      this.addInfant();
      this.openPanels.push(true);
    }
  }

  addAdult() {
    const isFirstAdult = this.adults.length === 0;
    let groupConfig = {
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdayDate: ['', [Validators.required, ageValidator(12, 99)]],
    };
    if (isFirstAdult) {
      Object.assign(groupConfig, {
        mobilePhone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        newsletter: [''],
      });
    }
    const adultGroup = this.fb.group(groupConfig);
    this.adults.push(adultGroup);
  }

  addChild() {
    const childGroup = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdayDate: ['', [Validators.required, ageValidator(2, 11)]],
    });
    this.children.push(childGroup);
  }

  addInfant() {
    const infantGroup = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdayDate: ['', [Validators.required, ageValidator(0, 1)]],
      associateInfantToAdult: ['', Validators.required],
    });
    this.infants.push(infantGroup);
  }

  setPanelState(index: number, state: boolean) {
    this.openPanels[index] = state;
  }

  get adults() {
    return this.form.get('adults') as FormArray;
  }

  get children() {
    return this.form.get('children') as FormArray;
  }

  get infants() {
    return this.form.get('infants') as FormArray;
  }

  redirectPrevious() {
    this.route.navigateByUrl('select');
  }

  redirectNext() {
    if (this.form.valid) {
      this.session.set('passengers', this.form.value);
      this.session.set('extras', '');
      this.route.navigateByUrl('/extras');
    } else {
      this.openPanels.fill(true);
      this.popup.failed('Form is invalid');
    }
  }
}
