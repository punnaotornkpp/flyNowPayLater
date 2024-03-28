import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  ISeat,
  ISeatAssign,
  ISeatCharge,
  ISeatMap,
} from '../../model/pricing-detail.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDispalyPassenger } from '../../model/passenger.model';
import { ExtrasComponent } from '../../components/extras/extras.component';
import { SessionStorage } from '../../core/helper/session.helper';
import { IData, IResponseAirline } from '../../model/submit.model';

export interface PassengerSeatSelection {
  passengerName: string;
  passengerIndex: number;
  airlineIndex: number;
  flightNumber: string;
  seat: ISeatCharge | null;
  selected?: boolean;
}

interface SeatSelection {
  passengerIndex: number;
  airlineIndex: number;
  selectedSeat: string;
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
    passengerIndex: 0,
    airlineIndex: 0,
    flightNumber: '',
  };
  seatRows: ISeatMap[] = [];
  seatCharges: ISeatCharge[] = [];
  seatAssign: ISeatAssign[] = [];
  show: boolean[] = [];
  currentShownIndex = 0;
  passengerSeatSelections: Map<string, PassengerSeatSelection> = new Map();
  selectedSeats: Map<string, SeatSelection> = new Map();
  selectedSeat: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExtrasComponent>,
    private session: SessionStorage,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pricing: IData;
      passengers: IDispalyPassenger[];
      seats: ISeat;
      default: PassengerSeatSelection[];
    }
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data.default && this.data.default.length > 0) {
      this.processDefaultSelections(this.data.default);
    }
    this.seatRows = this.data.seats.data[0].seatMaps;
    this.seatCharges = this.data.seats.data[0].seatCharges;
    this.seatAssign = this.data.seats.data[0].seatAssignments;
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
        passengerIndex: 0,
        airlineIndex: 0,
        flightNumber: firstAirline.travelInfos[0].flightNumber,
      };
    }
    this.data.pricing.airlines.forEach((_, index) => {
      this.show[index] = index === 0;
    });
  }

  processDefaultSelections(defaultSelections: PassengerSeatSelection[]): void {
    defaultSelections.forEach((selection) => {
      const {
        passengerIndex,
        airlineIndex,
        seat,
        flightNumber,
        passengerName,
      } = selection;
      if (seat) {
        const key = `${passengerIndex}-${airlineIndex}`;
        const seatKey = `${key}-${seat.seat}-${seat.rowNumber}`;
        this.passengerSeatSelections.set(seatKey, {
          passengerIndex,
          airlineIndex,
          seat,
          selected: true,
          flightNumber,
          passengerName,
        });
        this.selectedSeats.set(key, {
          passengerIndex,
          airlineIndex,
          selectedSeat: `${seat.rowNumber}${seat.seat}`,
        });
      }
    });
    this.passengerSeatSelections = new Map(this.passengerSeatSelections);
    this.selectedSeats = new Map(this.selectedSeats);
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
    airline: IResponseAirline
  ): void {
    this.selectedPassengerIndices[indexAirline] = indexPassenger;
    this.selectedValue = {
      passengerName: passenger,
      origin: airline.travelInfos[0].originName,
      destination: airline.travelInfos[0].destination,
      passengerIndex: indexPassenger,
      airlineIndex: indexAirline,
      flightNumber: airline.travelInfos[0].flightNumber,
    };
  }

  openShow(indexAirline: number): void {
    this.show[indexAirline] = !this.show[indexAirline];
    this.show.forEach((_, i) => {
      if (i !== indexAirline) this.show[i] = false;
    });
    if (this.show[indexAirline]) {
      const firstPassenger = this.data.passengers[0];
      const airline = this.data.pricing.airlines.find(
        (_, i) => i === indexAirline
      );
      if (airline) {
        this.selectedValue = {
          passengerName: firstPassenger.firstName,
          origin: airline.travelInfos[0].originName,
          destination: airline.travelInfos[0].destination,
          passengerIndex: 0,
          airlineIndex: indexAirline,
          flightNumber: airline.travelInfos[0].flightNumber,
        };
      }
    }
  }

  isSeatAvailable(rowNumber: number, seat: string): boolean {
    const isAssigned = this.seatAssign.some(
      (sa) => sa.rowNumber === rowNumber && sa.seat === seat
    );
    if (isAssigned) {
      return false;
    }
    return true;
  }

  isSeatSelected(
    rowNumber: number,
    seat: string,
    passengerIndex: number,
    airlineIndex: number
  ): boolean {
    const key = `${passengerIndex}-${airlineIndex}-${seat}-${rowNumber}`;
    const selection = this.passengerSeatSelections.get(key);
    return selection?.selected ?? false;
  }

  selectSeat(
    seatCharge: ISeatCharge,
    passengerIndex: number,
    airlineIndex: number,
    flightNumber: string,
    passengerName: string
  ): void {
    const key = `${passengerIndex}-${airlineIndex}`;
    this.passengerSeatSelections.forEach((value, keyMap) => {
      if (keyMap.startsWith(key)) {
        this.passengerSeatSelections.delete(keyMap);
      }
    });
    const newKey = `${key}-${seatCharge.seat}-${seatCharge.rowNumber}`;
    this.passengerSeatSelections.set(newKey, {
      passengerIndex,
      airlineIndex,
      seat: seatCharge,
      selected: true,
      flightNumber,
      passengerName,
    });
    const selectedSeat = `${seatCharge.rowNumber}${seatCharge.seat}`;
    this.selectedSeats.set(key, { passengerIndex, airlineIndex, selectedSeat });
    this.passengerSeatSelections = new Map(this.passengerSeatSelections);
    this.selectedSeats = new Map(this.selectedSeats);
  }

  getSelectedSeat(
    passengerIndex: number,
    airlineIndex: number
  ): string | undefined {
    const key = `${passengerIndex}-${airlineIndex}`;
    return this.selectedSeats.get(key)?.selectedSeat;
  }

  getSeatCharge(rowNumber: number, seat: string): any {
    return this.seatCharges.find(
      (sc) => sc.rowNumber === rowNumber && sc.seat === seat
    );
  }

  checkInfant(passengers: IDispalyPassenger[]) {
    const filteredPassengers = passengers.filter(
      (passenger) => passenger.type !== 'Infant'
    );
    return filteredPassengers;
  }

  getButtonColor(
    rowNumber: number,
    seat: string,
    passengerIndex: number,
    airlineIndex: number
  ): string {
    if (this.isSeatSelected(rowNumber, seat, passengerIndex, airlineIndex)) {
      return 'button-color-selected';
    }
    const isAssigned = this.seatAssign.some(
      (sa) => sa.rowNumber === rowNumber && sa.seat === seat
    );
    if (isAssigned) {
      return 'button-color-unavailable';
    }
    const seatCharge = this.seatCharges.find(
      (sc) => sc.rowNumber === rowNumber && sc.seat === seat
    );
    switch (seatCharge?.serviceCode) {
      case 'S500':
        return 'button-color-danger';
      case 'S300':
        return 'button-color-premium';
      case 'S150':
        return 'button-color-happy';
      default:
        return 'button-color-unavailable';
    }
  }

  Cancel() {
    this.dialogRef.close({ status: false, response: [], type: 0 });
  }

  Confirm() {
    const simplifiedSelections = Array.from(
      this.passengerSeatSelections.values()
    ).map((selection) => ({
      passengerIndex: selection.passengerIndex,
      airlineIndex: selection.airlineIndex,
      flightNumber: selection.flightNumber,
      seat: selection.seat,
      passengerName: selection.passengerName,
    }));
    let status = false;
    if (simplifiedSelections && simplifiedSelections.length > 0) {
      status = true;
    }
    this.dialogRef.close({
      status: status,
      response: simplifiedSelections,
      type: 0,
    });
  }
}
