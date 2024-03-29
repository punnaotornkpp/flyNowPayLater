import { IFlightFareKey } from './pricing-detail.model';

export interface IFareSelectionEvent {
  fareKey: IFlightFareKey;
  departureDate: string;
}

export interface ISelectEvent {
  setItem: IFlightFareKey;
  selectedItem: number;
}
