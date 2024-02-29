import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IAirport } from '../../model/airport.model';
import { AirportService } from '../../service/airport.service';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../service/booking.service';
import { SessionStorage } from '../../core/helper/session.helper';
import { setControls } from '../../core/helper/form.helper';
import { PopupService } from '../../service/popup.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends SubscriptionDestroyer implements OnInit {
  airport: IAirport[] = [];
  selectedToggleValue: number = 0;
  bookingForm: FormGroup;
  filteredAirports: Observable<IAirport[]>[] = [];
  filteredDestinations: Observable<IAirport[]>[] = [];
  showDropdown = false;
  selections = {
    adult: 0,
    child: 0,
    infant: 0,
  };
  minDate = new Date();

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private airportService: AirportService,
    private datePipe: DatePipe,
    private booking: BookingService,
    private session: SessionStorage,
    private popup: PopupService
  ) {
    super();
    this.bookingForm = this.fb.group({
      currency: ['THB', Validators.required],
      adult: [0, Validators.required],
      child: [0],
      infant: [0],
      promoCode: [''],
      languageCode: ['th', Validators.required],
      journeys: this.fb.array([
        this.fb.group({
          origin: ['', Validators.required],
          destination: ['', Validators.required],
          departureDate: ['', Validators.required],
          returnDate: [''],
        }),
      ]),
    });
    // this.journeys.get('returnDate')?.setValidators(Validators.required);
  }

  ngOnInit(): void {
    // const savedDataString = this.session.get('data');
    // const savedData = JSON.parse(savedDataString || '');
    // console.log(savedData.form);
    // setControls(savedData.form, this.bookingForm);
    // this.bookingForm.controls['promoCode'].setValue(savedData.form.promoCode);
    const obs = this.airportService
      .getAirport<IAirport[]>()
      .subscribe((resp: IAirport[]) => {
        this.airport = resp;
        this.initFilteredAirports();
      });
    this.AddSubscription(obs);
  }

  initFilteredAirports(): void {
    this.journeys.controls.forEach((_, index) => {
      this.setupFilteredAirports(index, 'origin');
      this.setupFilteredAirports(index, 'destination');
    });
  }

  setupFilteredAirports(index: number, field: 'origin' | 'destination'): void {
    const journey = this.journeys.at(index);
    if (!journey) return;

    const control = journey.get(field);
    if (!control) return;

    const observable = control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    if (field === 'origin') {
      this.filteredAirports[index] = observable;
    } else {
      this.filteredDestinations[index] = observable;
    }
  }

  get journeys(): FormArray {
    return this.bookingForm.get('journeys') as FormArray;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.showDropdown = false;
  }

  private _filter(value: string): IAirport[] {
    const filterValue = value.toLowerCase();
    return this.airport.filter(
      (option) =>
        option.name.toLowerCase().includes(filterValue) ||
        option.code.toLowerCase().includes(filterValue)
    );
  }

  onSubmit(): void {
    try {
      if (this.bookingForm.valid) {
        let formValue = this.bookingForm.value;
        formValue.journeys.forEach(
          (journey: {
            departureDate: string | number | Date | null;
            returnDate: string | number | Date | null;
          }) => {
            journey.departureDate = this.datePipe.transform(
              journey.departureDate,
              'yyyy-MM-dd'
            );
            journey.returnDate = this.datePipe.transform(
              journey.returnDate,
              'yyyy-MM-dd'
            );
          }
        );
        if (this.selectedToggleValue == 0) {
          if (formValue.journeys && formValue.journeys.length > 0) {
            const firstJourney = formValue.journeys[0];
            const returnJourney = {
              origin: firstJourney.destination,
              destination: firstJourney.origin,
              departureDate: firstJourney.returnDate,
            };
            const result = {
              ...formValue,
              journeys: [...formValue.journeys, returnJourney],
            };
            formValue = result;
          }
        }
        delete formValue.journeys[0].returnDate;
        this.session.set('data', { form: formValue });
        this.route.navigateByUrl('select');
      } else {
        this.popup.failed('Form is invalid');
      }
    } catch (error) {}
  }

  onToggleChange(event: MatButtonToggleChange) {
    this.selectedToggleValue = event.value;
    if (
      this.selectedToggleValue == 1 &&
      this.bookingForm.value.journeys.length > 1
    ) {
      const updatedJourneys = this.bookingForm.value.journeys.slice(0, 1);
      this.bookingForm.patchValue({
        journeys: updatedJourneys,
      });
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  increaseCount(category: string, event: MouseEvent): void {
    if (category === 'adult' || category === 'child' || category === 'infant') {
      this.selections[category]++;
      this.bookingForm.controls[category].setValue(this.selections[category]);
    }
    event.stopPropagation();
  }

  decreaseCount(category: string, event: MouseEvent): void {
    if (
      (category === 'adult' && this.selections[category] > 0) ||
      (category === 'child' && this.selections[category] > 0) ||
      (category === 'infant' && this.selections[category] > 0)
    ) {
      this.selections[category]--;
      this.bookingForm.controls[category].setValue(this.selections[category]);
    }
    event.stopPropagation();
  }

  get selectionDisplay(): string {
    return `${this.selections.adult} adult, ${this.selections.child} child, ${this.selections.infant} infant`;
  }

  getSelectionCount(category: string): number {
    if (category === 'adult' || category === 'child' || category === 'infant') {
      return this.selections[category];
    }
    return 0;
  }
}
