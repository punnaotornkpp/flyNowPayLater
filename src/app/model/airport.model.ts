export interface IAirport {
  name: string;
  code: string;
  currency: string;
  countryCode: string;
  restrictedOnDeparture?: boolean;
  restrictedOnDestination?: boolean;
}
