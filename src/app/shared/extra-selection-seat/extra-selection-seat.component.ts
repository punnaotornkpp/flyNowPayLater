import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  IAirlinePricing,
  IResponseDetailPricing,
  ISeat,
  ISeatMap,
} from '../../model/pricing-detail.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDispalyPassenger } from '../../model/passenger.model';
import { ExtrasComponent } from '../../components/extras/extras.component';
import { SeatRow } from '../../model/extras.model';

interface PassengerSeatSelection {
  passengerIndex: number;
  seat: string | null;
  row: number | null;
}

@Component({
  selector: 'app-extra-selection-seat',
  templateUrl: './extra-selection-seat.component.html',
  styleUrl: './extra-selection-seat.component.scss',
})
export class ExtraSelectionSeatComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  selectedPassengerIndices: { [key: number]: number } = {};
  selectedValue = {
    passengerName: '',
    origin: '',
    destination: '',
    index: 0,
  };
  seatRows: ISeatMap[] = [];
  passengerSeatSelections: PassengerSeatSelection[] = [];

  constructor(
    public dialogRef: MatDialogRef<ExtrasComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pricing: IResponseDetailPricing;
      passengers: IDispalyPassenger[];
      seats: ISeat;
    }
  ) {
    super();
  }

  ngOnInit(): void {
    this.seatRows = this.data.seats.data[0].seatMaps;
    this.selectedPassengerIndices = this.data.pricing.airlines.map(() => 0);
    if (
      this.data.passengers.length > 0 &&
      this.data.pricing.airlines.length > 0
    ) {
      const firstPassenger = this.data.passengers[0];
      const firstAirline = this.data.pricing.airlines[0];
      this.selectedValue = {
        passengerName: firstPassenger.firstName,
        origin: firstAirline.travelInfos[0].originName,
        destination: firstAirline.travelInfos[0].destination,
        index: 0,
      };
    }
    this.data.passengers.forEach((passenger, index) => {
      this.passengerSeatSelections.push({
        passengerIndex: index,
        seat: null,
        row: null,
      });
    });
  }

  getTitle(index: number) {
    if (index === 0) {
      return 'Depart';
    }
    return 'Return';
  }

  selectPassenger(
    indexAirline: number,
    indexPassenger: number,
    passenger: string,
    airline: IAirlinePricing
  ): void {
    this.selectedPassengerIndices[indexAirline] = indexPassenger;
    this.selectedValue = {
      passengerName: passenger,
      origin: airline.travelInfos[0].originName,
      destination: airline.travelInfos[0].destination,
      index: indexPassenger,
    };
  }

  Cancel() {
    this.dialogRef.close();
  }

  Confirm() {
    this.dialogRef.close(this.passengerSeatSelections);
  }

  isSeatAvailable(row: SeatRow, seat: string): boolean {
    return !row.blockedSeats?.includes(seat);
  }

  selectSeat(row: SeatRow, seat: string, passengerIndex: number): void {
    this.passengerSeatSelections[passengerIndex].seat = seat;
    this.passengerSeatSelections[passengerIndex].row = row.rowNumber;
    console.log(this.passengerSeatSelections[passengerIndex]);
  }
}
