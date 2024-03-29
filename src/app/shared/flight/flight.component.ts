import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailFlightComponent } from '../dialog-detail-flight/dialog-detail-flight.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IFare, ISchedule } from '../../model/flight-schedule';
import { IFlightFareKey } from '../../model/pricing-detail.model';
import { ISelectEvent } from '../../model/event.model';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.scss',
})
export class FlightComponent extends SubscriptionDestroyer implements OnInit {
  @Input() value!: ISchedule[];
  @Input() currentIndex: number = 0;
  @Input() isSelectedFlight: IFlightFareKey[] = [];
  @Output() onSelect = new EventEmitter<ISelectEvent>();

  selectedItem: number = 99;
  selectedDate!: IFare;
  isSmallScreen: boolean = false;
  isSelected: boolean = false;

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit(): void {
    if (this.isSelectedFlight && this.value) {
      this.value.forEach((schedule, index) => {
        this.isSelectedFlight.forEach(
          (selected: { journeyKey: string; fareKey: string }) => {
            if (schedule.journeyKey === selected.journeyKey) {
              const fareIndex = schedule.fares.findIndex(
                (fare) => fare.fareKey === selected.fareKey
              );
              if (fareIndex !== -1) {
                this.selectDetail(index, schedule.fares[fareIndex]);
                this.isSelected = true;
              }
            }
          }
        );
      });
    }
  }

  openDetailFlight(data: ISchedule) {
    this.dialog.open(DialogDetailFlightComponent, { data: data });
  }

  selectDetail(index: number, fare: IFare): void {
    this.selectedItem = index;
    this.selectedDate = fare;
    this.isSelected = false;
  }

  selectFlightFare(item: IFare) {
    let setItem: IFlightFareKey = {
      fareKey: item.fareKey,
      journeyKey: this.value[this.selectedItem].journeyKey,
    };
    this.onSelect.emit({ setItem: setItem, selectedItem: this.selectedItem });
  }
}
