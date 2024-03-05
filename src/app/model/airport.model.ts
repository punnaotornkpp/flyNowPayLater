export interface IAirport {
  name: string;
  code: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture?: boolean;
  restrictedOnDestination?: boolean;
  connections: IAirportConnection[];
}

export interface IAirportConnection {
  name: string;
  code: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture?: boolean;
  restrictedOnDestination?: boolean;
}
