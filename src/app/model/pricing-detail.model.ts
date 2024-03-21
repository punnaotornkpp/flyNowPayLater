export interface IPRICING {
  flightFareKey: IFlightFareKey[];
  includeExtraServices: boolean;
}

export interface IFlightFareKey {
  fareKey: string;
  journeyKey: string;
  extraService?: any[];
  selectedSeat?: any[];
  departureTime?: string;
}

export interface IResponsePricing {
  code: number;
  responseStatus: string;
  correlationId: string;
  securityToken: string;
  timestamp: string;
  data: IResponseDetailPricing;
}

export interface IResponseDetailPricing {
  totalAmount: string;
  currency: string;
  airlines: IAirlinePricing[];
}

export interface IAirlinePricing {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  travelInfos: ITravelInfoPricing[];
  pricingDetails: IPricingDetail[];
  bundleDetails: IBundleDetails[];
  availableExtraServices: IAvailableExtraService[];
}

export interface IBundleDetails {
  ssrCode: string;
  description: string;
}

export interface ITravelInfoPricing {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  duration: string;
  originName: string;
  destinationName: string;
}

export interface IPricingDetail {
  paxTypeCode: string;
  paxCount: number;
  fareAmount: string;
  fareAmountIncludingTax: string;
  taxesAndFees: ITaxesAndFee[];
}

export interface ITaxesAndFee {
  taxCode: string;
  taxName: string;
  amount: string;
  isSSR?: boolean;
}

export interface TaxDetails {
  paxType: string;
  count: number;
  AT: number;
  VAT: number;
}

export interface ISSR {
  code: number;
  responseStatus: string;
  correlationId: string;
  securityToken: string;
  timestamp: string;
  data: IAvailableExtraService[];
}

export interface IAvailableExtraService {
  ssrCode: string;
  description: string;
  amount: string;
  currency: string;
  departureDate: string;
  flightNumber: string;
  paxTypeCode: string;
  vat: IVat[];
}

export interface IVat {
  amount: string;
  taxCode: string;
  taxName: string;
}

export interface ISeat {
  code: number;
  responseStatus: string;
  correlationId: string;
  securityToken: string;
  timestamp: string;
  data: ISeatDetail[];
}

export interface ISeatDetail {
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  flightNumber: string;
  seatAssignments: ISeatAssign[];
  seatCharges: ISeatCharge[];
  seatMaps: ISeatMap[];
}

export interface ISeatAssign {
  rowNumber: number;
  seat: string;
  passengerType: string;
}

export interface ISeatCharge {
  rowNumber: number;
  seat: string;
  serviceCode: string;
  description: string;
  amount: string;
  currency: string;
  available: boolean;
}

export interface ISeatMap {
  rowNumber: number;
  seats: string;
  wingSeats: string | null;
  exitSeats: string | null;
  blockedSeats: string | null;
  preBlockedSeats: string | null;
}
