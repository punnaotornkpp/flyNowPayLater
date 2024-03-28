import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IAirport } from '../../model/airport.model';
import { AirportService } from '../../service/airport.service';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { HostListener } from '@angular/core';
import { SessionStorage } from '../../core/helper/session.helper';
import { setControls, setControlsArray } from '../../core/helper/form.helper';
import { PopupService } from '../../service/popup.service';
import { PassengerSelections } from '../../model/passenger.model';
import { JourneySearch } from '../../model/session.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedService } from '../../service/shared.service';
import { DateTime } from '../../core/helper/date.helper';
import { LanguageService } from '../../service/language.service';
import { TranslateService } from '@ngx-translate/core';

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
  selections: PassengerSelections = {
    adult: 1,
    child: 0,
    infant: 0,
  };
  minDate = new Date();
  minReturnDate: Date[] = [];
  sessionData: any;
  journeysArray: FormArray;
  formSubmitted = false;
  categories: { key: string; translatedName: string }[] = [];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private airportService: AirportService,
    private session: SessionStorage,
    private popup: PopupService,
    private sharedService: SharedService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    super();
    this.bookingForm = this.fb.group({
      typeRoute: [0, Validators.required],
      currency: ['THB', Validators.required],
      adult: [1, [Validators.required, Validators.min(1)]],
      child: [0],
      infant: [0],
      languageCode: ['th', Validators.required],
      promoCode: [''],
      journeys: this.fb.array([
        this.fb.group({
          title: ['Depart'],
          origin: ['', Validators.required],
          originName: ['', Validators.required],
          destination: ['', Validators.required],
          destinationName: ['', Validators.required],
          departureDate: ['', Validators.required],
          returnDate: ['', Validators.required],
        }),
      ]),
    });

    this.journeysArray = this.bookingForm.get('journeys') as FormArray;
    this.journeysArray.valueChanges.subscribe((changes) => {
      changes.forEach((journey: JourneySearch, index: number) => {
        if (journey.departureDate) {
          this.minReturnDate[index] = new Date(journey.departureDate);
          this.minReturnDate[index].setDate(
            this.minReturnDate[index].getDate()
          );
          if (
            journey.returnDate &&
            new Date(journey.returnDate) < new Date(journey.departureDate)
          ) {
            const control = (this.journeysArray.at(index) as FormGroup)
              .controls['returnDate'];
            control.setValue(journey.departureDate);
          }
        }
      });
    });
  }

  updateTranslatedCategories() {
    const categoryKeys = ['adult', 'child', 'infant'];
    this.categories = categoryKeys.map((key) => ({
      key,
      translatedName: this.translate.instant(key),
    }));
  }

  ngOnInit(): void {
    const obs1 = this.languageService.getCurrentLanguage().subscribe(() => {
      const obs = this.airportService
        .getAirport()
        .subscribe((resp: IAirport[]) => {
          this.airport = resp;
          if (typeof window !== 'undefined' && window.sessionStorage) {
            try {
              this.updateTranslatedCategories();
              const sessionDataString = this.session.get('history');
              if (sessionDataString) {
                this.sessionData = JSON.parse(sessionDataString);
                this.selectedToggleValue = this.sessionData?.form?.typeRoute;
                if (this.sessionData?.form) {
                  setControls(this.sessionData.form, this.bookingForm);
                  const firstJourneyData = this.sessionData.form.journeys[0];
                  if (firstJourneyData) {
                    const fieldsToUpdate = [
                      'returnDate',
                      'departureDate',
                      'originName',
                      'origin',
                      'destinationName',
                      'destination',
                    ];
                    setControlsArray(
                      this.journeysArray.at(0) as FormGroup,
                      fieldsToUpdate,
                      firstJourneyData
                    );
                  }
                }
                if (this.sessionData?.form) {
                  this.selections = {
                    adult: this.sessionData.form.adult,
                    child: this.sessionData.form.child,
                    infant: this.sessionData.form.infant,
                  };
                }
              }
            } catch (error) {
              this.route.navigateByUrl('');
            }
          }
          this.initFilteredAirports();
        });
      this.AddSubscription(obs);
    });
    this.AddSubscription(obs1);
  }

  initFilteredAirports(): void {
    this.journeysArray.controls.forEach((_, index) => {
      this.setupFilteredAirports(index, 'originName');
      this.setupFilteredAirports(index, 'destinationName');
    });
  }

  setupFilteredAirports(
    index: number,
    field: 'originName' | 'destinationName'
  ): void {
    const journey = this.journeysArray.at(index);
    if (!journey) return;

    const control = journey.get(field);
    if (!control) return;

    const observable = control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    if (field === 'originName') {
      this.filteredAirports[index] = observable;
    } else {
      this.filteredDestinations[index] = observable;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.showDropdown = false;
  }

  private _filter(value: string | { toString: () => string }): IAirport[] {
    const stringValue = typeof value === 'string' ? value : value.toString();
    const filterValue = stringValue.toLowerCase();
    return this.airport.filter(
      (option) =>
        option.name.toLowerCase().includes(filterValue) ||
        option.code.toLowerCase().includes(filterValue)
    );
  }

  onSubmit(): void {
    try {
      if (this.selectedToggleValue === 1) {
        const firstJourneyGroup = this.journeysArray.at(0) as FormGroup;
        firstJourneyGroup.controls['returnDate'].clearValidators();
        firstJourneyGroup.controls['returnDate'].updateValueAndValidity();
      }
      if (this.bookingForm.valid) {
        let formValue = this.bookingForm.value;
        formValue.journeys.forEach(
          (journey: {
            departureDate: string | number | Date | null;
            returnDate: string | number | Date | null;
          }) => {
            if (journey.departureDate) {
              const date = new Date(journey.departureDate);
              journey.departureDate = DateTime.setTimeZone(date);
            }

            if (journey.returnDate) {
              const date = new Date(journey.returnDate);
              journey.returnDate = DateTime.setTimeZone(date);
            }
          }
        );
        if (this.selectedToggleValue == 0) {
          if (formValue.journeys && formValue.journeys.length > 0) {
            const firstJourney = formValue.journeys[0];
            const returnJourney = {
              origin: firstJourney.destination,
              originName: firstJourney.destinationName,
              destination: firstJourney.origin,
              destinationName: firstJourney.originName,
              departureDate: firstJourney.returnDate,
              title: 'Return',
            };
            const result = {
              ...formValue,
              journeys: [...formValue.journeys, returnJourney],
            };
            formValue = result;
          }
        }
        this.popup.success('Search success');
        this.session.set('history', { form: formValue });
        this.session.set('display', '');
        this.session.set('flightFareKey', '');
        this.session.set('passengers', '');
        this.session.set('formSubmit', '');
        this.session.set('extraContent', '');
        this.session.set('extraPricing', '');
        this.session.set('pricing', '');
        this.session.set('extras', '');
        this.session.set('securityToken', '');
        this.session.remove('schedule');
        this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.sharedService.triggerHeaderRefresh();
          this.route.navigate(['select']);
        });
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

  updateCount(category: string, increment: boolean, event: MouseEvent): void {
    if (increment) {
      if (
        (category === 'adult' || category === 'child') &&
        this.selections[category] < 9
      ) {
        this.selections[category]++;
      } else if (
        category === 'infant' &&
        this.selections[category] < this.selections.adult
      ) {
        this.selections[category]++;
      }
    } else {
      if (this.selections[category] > 0) {
        this.selections[category]--;
      }
    }
    this.bookingForm.controls[category].setValue(this.selections[category]);
    event.stopPropagation();
  }

  translateCategory(category: any): string {
    const translations: Record<any, string> = {
      adult: this.translate.instant('adult'),
      child: this.translate.instant('child'),
      infant: this.translate.instant('infant'),
    };
    return translations[category];
  }

  get selectionDisplay() {
    return `${this.translateCategory('adult')} ${
      this.selections.adult
    }, ${this.translateCategory('child')} ${
      this.selections.child
    }, ${this.translateCategory('infant')} ${this.selections.infant}`;
  }

  isValidAdultCount(): boolean {
    return this.selections.adult >= 1;
  }

  isValidInfantCount(): boolean {
    return this.selections.infant <= this.selections.adult;
  }

  onOptionSelected(
    event: MatAutocompleteSelectedEvent,
    journeyIndex: number,
    type: number
  ) {
    const option = event.option.value;
    const journeyGroup = this.journeysArray.at(journeyIndex) as FormGroup;
    if (type === 0) {
      journeyGroup.controls['origin'].setValue(option.code);
      journeyGroup.controls['originName'].setValue(option.name);
    } else if (type === 1) {
      journeyGroup.controls['destination'].setValue(option.code);
      journeyGroup.controls['destinationName'].setValue(option.name);
    }
  }
}
