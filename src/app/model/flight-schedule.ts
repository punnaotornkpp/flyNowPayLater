export interface IFlight {
  code: number;
  responseStatus: string;
  correlationId: string;
  securityToken: string;
  timestamp: string;
  content: IFlightRoute[];
}

export interface IFlightRoute {
  origin: string;
  destination: string;
  journey: IJourney[];
}

export interface IJourney {
  departureDate: string;
  lowestFare: string;
  schedules: ISchedule[];
}

export interface ISchedule {
  departureDate: string;
  arrivalDate: string;
  international: boolean;
  travelInfos: ITravelInfo[];
  fares: IFare[];
  journeyKey: string;
}

export interface ITravelInfo {
  LFID: string;
  PFID: string;
  departureDate: string;
  origin: string;
  destination: string;
  international: boolean;
  arrivalDate: string;
  duration: string;
  flightNumber: string;
  aircraftDescription: string;
}

export interface IFare {
  productCode: string;
  productName: string;
  currency: string;
  fareAmount: number;
  discount: number;
  bundleCode: string;
  seatsAvailable: number;
  fareKey: string;
  paxFareTaxBreakdown: IPaxFareTaxBreakdown[];
}
export interface IPaxFareTaxBreakdown {
  paxTypeCode: string;
  fareAmount: number;
  fareAmountIncludingTax: number;
  fareBasisCode: string;
  taxesAndFees: ITaxesAndFee[];
}

export interface ITaxesAndFee {
  amount: number;
  taxCode: string;
  taxName: string;
}
