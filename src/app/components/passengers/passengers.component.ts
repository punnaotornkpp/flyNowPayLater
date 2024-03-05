import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { Router } from '@angular/router';
import { SessionStorage } from '../../core/helper/session.helper';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightSearchForm } from '../../model/session.model';
import { PopupService } from '../../service/popup.service';

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
        const item = this.session.get('data');
        this.sessionValue = JSON.parse(item).form as FlightSearchForm;
        console.log(this.sessionValue);
        this.populateFormArrays(this.sessionValue);
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  openPanel(adjustedIndex: number) {
    this.openPanels[adjustedIndex] = true;
  }

  populateFormArrays(data: any) {
    for (let i = 0; i < data.adult; i++) {
      this.addAdult();
      this.openPanels.push(i === 0);
    }
    for (let i = 0; i < data.child; i++) {
      this.addChild();
    }
    for (let i = 0; i < data.infant; i++) {
      this.addInfant();
    }
  }

  addAdult() {
    const isFirstAdult = this.adults.length === 0;
    let groupConfig = {
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
    };
    if (isFirstAdult) {
      Object.assign(groupConfig, {
        mobilePhone: ['', Validators.required],
        email: ['', Validators.required],
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
      brithDate: ['', Validators.required],
    });
    this.children.push(childGroup);
  }

  addInfant() {
    const infantGroup = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      brithDate: ['', Validators.required],
      associateInfantToAdult: ['', Validators.required],
    });
    this.infants.push(infantGroup);
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

  nextStep() {
    const currentIndex = this.openPanels.findIndex((open) => open);
    if (currentIndex >= 0 && currentIndex < this.openPanels.length - 1) {
      this.openPanels[currentIndex] = false;
      this.openPanels[currentIndex + 1] = true;
    }
  }

  prevStep() {
    const currentIndex = this.openPanels.findIndex((open) => open);
    if (currentIndex > 0) {
      this.openPanels[currentIndex] = false;
      this.openPanels[currentIndex - 1] = true;
    }
  }

  redirectPrevious() {
    this.route.navigateByUrl('select');
  }

  redirectNext() {
    if (this.form.valid) {
      this.route.navigateByUrl('extras');
    } else {
      this.popup.failed('Form is invalid');
    }
  }
}
