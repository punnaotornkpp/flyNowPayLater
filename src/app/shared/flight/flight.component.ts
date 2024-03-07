import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailFlightComponent } from '../dialog-detail-flight/dialog-detail-flight.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ISchedule } from '../../model/flight-schedule';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.scss',
})
export class FlightComponent extends SubscriptionDestroyer implements OnInit {
  @Input() value!: ISchedule[];
  selectedItem: number = 0;
  selectedPrice: number = 0;
  isSmallScreen: boolean = false;

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
  ngOnInit(): void {}

  openDetailFlight(data: ISchedule) {
    this.dialog.open(DialogDetailFlightComponent, { data: data });
  }

  selectDetail(item: number, price: number): void {
    this.selectedItem = item;
    this.selectedPrice = price;
  }
}
