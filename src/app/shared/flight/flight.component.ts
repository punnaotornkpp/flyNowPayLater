import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogDetailFlightComponent } from '../dialog-detail-flight/dialog-detail-flight.component';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.scss',
})
export class FlightComponent extends SubscriptionDestroyer implements OnInit {
  selectedItem: number = 0;
  selectedPrice: number = 0;

  constructor(private dialog: MatDialog) {
    super();
  }
  ngOnInit(): void {}

  openDetailFlight(item: any) {
    const dialogRef = this.dialog.open(DialogDetailFlightComponent, {
      width: '600px',
      // data: { name: this.name, animal: this.animal },
    });
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  selectDetail(item: number, price: number): void {
    this.selectedItem = item;
    this.selectedPrice = price;
  }
}
