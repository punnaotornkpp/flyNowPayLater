import { Type } from '@angular/core';
import { ExtraBaggageComponent } from '../shared/extra-baggage/extra-baggage.component';
import { ExtraSelectionSeatComponent } from '../shared/extra-selection-seat/extra-selection-seat.component';
import { ExtraSpecialBaggageComponent } from '../shared/extra-special-baggage/extra-special-baggage.component';
import { ISeatCharge, IVat } from './pricing-detail.model';

export interface IExtras {
  id: number;
  title: string;
  content: string;
  status: boolean;
  type: number;
  button: string;
  detail: IExtrasDetail;
  img: string;
}

interface IExtrasDetail {
  title: string;
  link: string;
}

type DialogComponentType =
  | ExtraSelectionSeatComponent
  | ExtraBaggageComponent
  | ExtraSpecialBaggageComponent;

export interface DialogConfig {
  [key: number]: {
    component: Type<DialogComponentType>;
    width?: string;
    height?: string;
    maxWidth?: string;
    panelClass?: string;
    data?: any;
    passengers?: any;
  };
}

export interface SeatRow {
  rowNumber: number;
  seats: string;
  wingSeats: string | null;
  exitSeats: string | null;
  blockedSeats: string | null;
  preBlockedSeats: string | null;
}

export interface PassengerSeatSelection {
  passengerName: string;
  passengerIndex: number;
  airlineIndex: number;
  flightNumber: string;
  seat: ISeatCharge | null;
  selected?: boolean;
}

export interface SeatSelection {
  passengerIndex: number;
  airlineIndex: number;
  selectedSeat: string;
}

export interface SsrSelection {
  passengerName: string;
  ssrCode: string;
  flightNumber: string;
  passengerIndex: number;
  airlineIndex: number;
  amount: number;
}

export interface SsrOption {
  ssrCode: string;
  description: string;
  amount?: string;
  currency?: string;
  flightNumber: string;
  paxTypeCode?: string;
  vat?: IVat[];
}

export interface BundleInfo {
  bundleName: string;
  baggageInfo: string;
}
