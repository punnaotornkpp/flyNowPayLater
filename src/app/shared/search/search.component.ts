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
import { Observable } from 'rxjs';
import { IAirport } from '../../model/airport.model';
import { AirportService } from '../../service/airport.service';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends SubscriptionDestroyer implements OnInit {
  airport: IAirport[] = [];
  selectedToggleValue: number = 0;
  bookingForm: FormGroup;
  showDropdown = false;

  selections = {
    adult: 0,
    child: 0,
    infant: 0,
  };

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private airportService: AirportService
  ) {
    super();
    this.bookingForm = this.fb.group({
      currency: ['THB', Validators.required],
      adult: [0],
      child: [0],
      infant: [0],
      promoCode: [''],
      languageCode: ['th', Validators.required],
      journeys: this.fb.array([this.initJourney()]),
    });
    const obs = this.airportService
      .getAirport<IAirport[]>()
      .subscribe((resp) => {
        this.airport = resp;
      });
    this.AddSubscription(obs);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.showDropdown = false;
  }

  ngOnInit(): void {}

  initJourney(): FormGroup {
    return this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    // this.route.navigateByUrl('select');
    console.log(this.bookingForm.value);
  }

  onToggleChange(event: MatButtonToggleChange) {
    this.selectedToggleValue = event.value;
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  increaseCount(category: string, event: MouseEvent): void {
    if (category === 'adult' || category === 'child' || category === 'infant') {
      this.selections[category]++;
    }
    event.stopPropagation();
  }

  decreaseCount(category: string, event: MouseEvent): void {
    if (
      category === 'adult' ||
      category === 'child' ||
      (category === 'infant' && this.selections[category] > 0)
    ) {
      this.selections[category]--;
    }
    event.stopPropagation();
  }

  get selectionDisplay(): string {
    return `Adults: ${this.selections.adult}, Children: ${this.selections.child}, Infants: ${this.selections.infant}`;
  }

  getSelectionCount(category: string): number {
    if (category === 'adult' || category === 'child' || category === 'infant') {
      return this.selections[category];
    }
    return 0; // Default or error value
  }
}
