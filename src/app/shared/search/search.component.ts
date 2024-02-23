import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MOCK_AIRPORT } from '../../../assets/mock';
import { MatDialog } from '@angular/material/dialog';
import { SelectPassengersComponent } from '../select-passengers/select-passengers.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  // encapsulation: ViewEncapsulation.None,
})
export class SearchComponent extends SubscriptionDestroyer implements OnInit {
  mock_airport = MOCK_AIRPORT;
  selectedToggleValue: number = 0;
  bookingForm: FormGroup;
  items = [{ name: 'Item 1', quantity: 1 }];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    super();
    this.bookingForm = this.fb.group({
      currency: ['THB', Validators.required],
      adult: [0, Validators.required],
      child: [0, Validators.required],
      infant: [0, Validators.required],
      promoCode: [''],
      languageCode: ['th', Validators.required],
      journeys: this.fb.array([this.initJourney()]),
    });
  }

  ngOnInit(): void {}

  initJourney() {
    return this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
    });
  }

  addJourney() {
    const control = <FormArray>this.bookingForm.controls['journeys'];
    control.push(this.initJourney());
  }

  removeJourney(i: number) {
    const control = <FormArray>this.bookingForm.controls['journeys'];
    control.removeAt(i);
  }

  onToggleChange(event: MatButtonToggleChange) {
    this.selectedToggleValue = event.value;
  }

  onSubmit() {
    this.route.navigateByUrl('select');
    console.log(this.bookingForm.value);
  }

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(SelectPassengersComponent, {
      width: '250px',
      data: { items: [item] },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
