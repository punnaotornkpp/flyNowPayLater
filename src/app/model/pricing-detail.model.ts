export interface IPRICING {
  flightFareKey: IFlightFareKey[];
  includeExtraServices: boolean;
}

export interface IFlightFareKey {
  fareKey: string;
  journeyKey: string;
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
  bundleDetails: any[];
  availableExtraServices: IAvailableExtraService[];
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
  isSSR: boolean;
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
