import { IPricingDetail } from './pricing-detail.model';

export interface IResponseSubmit {
  code: number;
  responseStatus: string;
  correlationId: string;
  securityToken: string;
  timestamp: string;
  data: IData;
}

export interface IData {
  confirmationNumber: string;
  bookingNumber: string;
  totalAmount: string;
  currency: string;
  status: string;
  bookDate: string;
  holdTimeExpiredDate: string;
  airlines: IResponseAirline[];
}

export interface IResponseAirline {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  originName: string;
  destinationName: string;
  travelInfos: IResponseTravelInfo[];
  passengerDetails: IResponsePassengerDetail[];
}

export interface IResponseTravelInfo {
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  duration: string;
}

export interface IResponsePassengerDetail {
  paxNumber: number;
  passengerType: string;
  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
  dateOfBirth: string;
  mobilePhone: string;
  email: string;
  isPrimary: boolean;
  gender: string;
  passportNumber: string;
  expirationDate: string;
  issueCountry: string;
  nationality: string;
  seatSelect: string;
  pricingDetails: IPricingDetail;
}
