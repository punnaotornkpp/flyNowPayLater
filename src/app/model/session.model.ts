export interface FlightSearchForm {
  typeRoute: number;
  currency: string;
  adult: number;
  child: number;
  infant: number;
  promoCode: string;
  languageCode: string;
  journeys: JourneySearch[];
}

export interface JourneySearch {
  title?: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  returnDate?: string;
}
