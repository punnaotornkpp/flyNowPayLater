import { IFlightFareKey } from './pricing-detail.model';

export interface PassengerSelections {
  [key: string]: number;
  adult: number;
  child: number;
  infant: number;
}

export interface IDispalyPassenger {
  title: string;
  firstName: string;
  lastName: string;
  birthdayDate: Date;
  mobilePhone?: string;
  email?: string;
  newsletter?: string;
  type: string;
  associateInfantToAdult?: string;
}

export interface IPassengerInfo {
  paxNumber: number;
  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
  dateOfBirth: string;
  passengerType: string;
  mobilePhone: string;
  gender: string;
  flightFareKey: IFlightFareKey[];
  email?: string;
}

export interface IPassengers {
  adults: IAdult[];
  children: IChildren[];
  infants: IInfant[];
}

export interface IAdult {
  title: string;
  firstName: string;
  lastName: string;
  birthdayDate: string;
  mobilePhone: string;
  email: string;
  newsletter: string;
}

export interface IChildren {
  title: string;
  firstName: string;
  lastName: string;
  birthdayDate: string;
}

export interface IInfant {
  title: string;
  firstName: string;
  lastName: string;
  birthdayDate: string;
  associateInfantToAdult: string;
}
