import { IExtras } from '../app/model/extras.model';

export const MOCK_EXTRAS: IExtras[] = [
  {
    id: 0,
    title: 'Seat Selection',
    content:
      'Make your smiles wider throughout your journey and happier than ever. That will allow you to choose the right seat in your favorite zone in suitable price',
    status: false,
    button: 'Close',
    detail: {
      title: 'Details',
      link: 'https://content.nokair.com/en/Booking/How-to-Select-Seat.aspx?aliaspath=%2fBooking%2fHow-to-Select-Seat',
    },
    img: 'https://images.prismic.io/nokair-ezycommerce/525fbf92-6e88-471c-b326-2fe074e12fac_service-seat.jpg?auto=compress,format',
  },
  {
    id: 1,
    title: 'Nok Baggage',
    content:
      'Confident throughout your trip with our pre-purchased baggage allowance service where you can choose the weight you desire. No matter how much baggage or souvenirs you have, you wont have to worry about excess baggage',
    status: false,
    button: 'Edit',
    detail: {
      title: 'Details',
      link: 'https://content.nokair.com/en/Journey-Planning/Baggage.aspx',
    },
    img: 'https://images.prismic.io/nokair-ezycommerce/5feaf98f-63ad-45aa-8e54-6d3a1c8221a2_service-baggage.jpg?auto=compress,format',
  },
];
