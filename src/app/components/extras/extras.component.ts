import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { MOCK_EXTRAS } from '../../../assets/language/mock.extras';
import { PopupService } from '../../service/popup.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ExtraSelectionSeatComponent,
  PassengerSeatSelection,
} from '../../shared/extra-selection-seat/extra-selection-seat.component';
import {
  ExtraBaggageComponent,
  SsrSelection,
} from '../../shared/extra-baggage/extra-baggage.component';
import { ExtraSpecialBaggageComponent } from '../../shared/extra-special-baggage/extra-special-baggage.component';
import { DialogConfig } from '../../model/extras.model';
import {
  IAvailableExtraService,
  IFlightFareKey,
  IPRICING,
  IResponsePricing,
  ISSR,
  ISeat,
  ISeatCharge,
} from '../../model/pricing-detail.model';
import { BookingService } from '../../service/booking.service';
import {
  IAdult,
  IChildren,
  IDispalyPassenger,
  IInfant,
  IPassengerInfo,
} from '../../model/passenger.model';
import { DateTime } from '../../core/helper/date.helper';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss',
})
export class ExtrasComponent extends SubscriptionDestroyer implements OnInit {
  items = MOCK_EXTRAS;
  ssr!: ISSR;
  seat!: ISeat;
  spinner: boolean = false;
  loading: boolean = false;
  wait: boolean = true;
  pricing!: IResponsePricing;
  passengers: IDispalyPassenger[] = [];
  dialogConfig!: DialogConfig;
  ssrBaggage: IAvailableExtraService[] = [];
  form = {
    actionType: 'summary',
    paymentMethod: '',
    passengerInfos: [{}],
  };
  securityToken: string = '';
  defaultSeat!: PassengerSeatSelection[];
  defaultBaggage!: SsrSelection[];
  summaryAmount: number = 0;

  constructor(
    private route: Router,
    private session: SessionStorage,
    private popup: PopupService,
    private dialog: MatDialog,
    private booking: BookingService,
    private sharedService: SharedService
  ) {
    super();
  }

  async ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        this.sharedService.triggerHeaderRefresh();
        const securityToken =
          JSON.parse(this.session.get('schedule')).securityToken || '';
        const extraContent = JSON.parse(this.session.get('extraContent'));
        if (extraContent) {
          this.items = extraContent.items;
          this.defaultSeat = extraContent.seat;
          this.defaultBaggage = extraContent.baggage;
        }
        this.securityToken = securityToken;
        const flightFareKey: IPRICING = JSON.parse(
          this.session.get('flightFareKey')
        );
        this.pricing = JSON.parse(this.session.get('pricing'));

        this.summaryAmount = Number(this.pricing.data.totalAmount);
        const passengers = JSON.parse(this.session.get('passengers'));
        this.passengers = [
          ...passengers.adults.map((p: IAdult[]) => ({ ...p, type: 'Adult' })),
          ...passengers.children.map((p: IChildren[]) => ({
            ...p,
            type: 'Child',
          })),
          ...passengers.infants.map((p: IInfant[]) => ({
            ...p,
            type: 'Infant',
          })),
        ];
        const extras = JSON.parse(this.session.get('extras'));
        if (extras) {
          this.ssr = extras.ssr;
          this.seat = extras.seat;
          this.setDialog();
          this.preparePassengerInfos();
          this.session.set('formSubmit', this.form);
          this.spinner = true;
          this.loading = true;
        } else {
          await Promise.all([
            this.getSSR(flightFareKey, securityToken),
            this.getSeats(flightFareKey, securityToken),
          ]);
          this.session.set('extras', {
            ssr: this.ssr,
            seat: this.seat,
          });
          this.spinner = true;
          this.loading = true;
          this.setDialog();
          this.preparePassengerInfos(); /////
          this.session.set('formSubmit', this.form);
        }
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  setDialog() {
    this.dialogConfig = {
      0: {
        component: ExtraSelectionSeatComponent,
        width: '98vw',
        height: '95vh',
        maxWidth: '98vw',
        data: {
          pricing: this.pricing.data,
          passengers: this.passengers,
          seats: this.seat,
          default: this.defaultSeat,
        },
      },
      1: {
        component: ExtraBaggageComponent,
        width: '85vw',
        height: '95vh',
        maxWidth: '85vw',
        data: {
          pricing: this.pricing.data,
          passengers: this.passengers,
          ssr: this.ssr,
          selected: this.defaultBaggage,
        },
      },
      2: {
        component: ExtraSpecialBaggageComponent,
        width: '1000px',
        height: '500px',
      },
    };
  }

  async getSSR(flightFareKey: IPRICING, securityToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const obs = this.booking.getSSR(flightFareKey, securityToken).subscribe({
        next: (resp) => {
          this.ssr = resp.data;
          resolve(resp.data);
        },
        error: (error) => {
          this.popup.waring('Sorry, something went wrong.');
          console.log(error);
          reject(error);
        },
      });
      this.AddSubscription(obs);
    });
  }

  async getSeats(flightFareKey: IPRICING, securityToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const obs = this.booking
        .getSeat(flightFareKey.flightFareKey[0], securityToken)
        .subscribe({
          next: (resp) => {
            this.seat = resp;
            resolve(resp);
          },
          error: (error) => {
            this.popup.waring('Sorry, something went wrong.');
            console.log(error);
            reject(error);
          },
        });
      this.AddSubscription(obs);
    });
  }

  redirectPrevious() {
    this.route.navigateByUrl('passengers');
  }

  redirectNext() {
    if (this.summaryAmount < 3000) {
      this.popup.waring('The installment payment must exceed 3000');
      return;
    }
    this.route.navigateByUrl('payment');
  }

  openDialog(id: number): void {
    const config = this.dialogConfig[id];
    if (config) {
      const { component, ...options } = config;
      const dialogRef = this.dialog.open(component, options);
      dialogRef
        .afterClosed()
        .subscribe(
          (
            resp: { status: boolean; response: []; type: number } | undefined
          ) => {
            if (resp) {
              this.setStatus(id, resp);
              this.session.set('extraContent', {
                items: this.items,
                seat: this.defaultSeat,
                baggage: this.defaultBaggage,
              });
            }
          }
        );
    } else {
      this.popup.info('There are no details on this extra service.');
    }
  }

  setStatus(id: number, resp: { status: boolean; response: []; type: number }) {
    this.items[id].status = resp.status;
    if (resp.status) {
      if (0 === resp.type) {
        this.items[id].content = `${this.showSeat(resp.response)}`;
        this.updateSeat(resp.response);
      } else if (1 === resp.type) {
        this.items[id].content = `${this.showBaggage(resp.response)}`;
        this.updateBaggage(resp.response);
      } else {
        this.items[id].content = this.items[id].content;
      }
      this.items[id].detail.title = '';
    } else {
    }
  }

  updateSeat(resp: PassengerSeatSelection[]) {
    this.defaultSeat = resp;
    if (this.defaultSeat && this.defaultSeat.length > 0) {
      this.setDialog();
    }
    resp.forEach((extra) => {
      this.form.passengerInfos.forEach((passenger: any) => {
        if (passenger.firstName === extra.passengerName) {
          passenger.flightFareKey.forEach((flight: any) => {
            if (flight.journeyKey.includes(extra.flightNumber)) {
              if (!flight.selectedSeat) {
                flight.selectedSeat = [];
              }
              const existingEntryIndex = flight.selectedSeat.findIndex(
                (es: any) => es.flightNumber === extra.flightNumber
              );
              if (existingEntryIndex !== -1) {
                flight.selectedSeat[existingEntryIndex] = {
                  flightNumber: extra.flightNumber,
                  rowNumber: extra.seat?.rowNumber,
                  seatSelected: extra.seat?.seat,
                };
              } else {
                flight.selectedSeat = [
                  {
                    flightNumber: extra.flightNumber,
                    rowNumber: extra.seat?.rowNumber,
                    seatSelected: extra.seat?.seat,
                  },
                ];
              }
            }
          });
        }
      });
    });
    this.updateSummary();
  }

  updateBaggage(resp: SsrSelection[]) {
    this.defaultBaggage = resp;
    if (this.defaultBaggage && this.defaultBaggage.length > 0) {
      this.setDialog();
    }
    resp.forEach((extra) => {
      this.form.passengerInfos.forEach((passenger: any) => {
        if (
          passenger.firstName + ' ' + passenger.lastName ===
          extra.passengerName
        ) {
          passenger.flightFareKey.forEach((flight: any) => {
            if (flight.journeyKey.includes(extra.flightNumber)) {
              if (!flight.extraService) {
                flight.extraService = [];
              }
              const existingEntryIndex = flight.extraService.findIndex(
                (es: any) => es.flightNumber === extra.flightNumber
              );
              if (existingEntryIndex !== -1) {
                flight.extraService[existingEntryIndex].ssrCode = extra.ssrCode;
              } else {
                flight.extraService.push({
                  flightNumber: extra.flightNumber,
                  ssrCode: extra.ssrCode,
                });
              }
            }
          });
        }
      });
    });
    this.updateSummary();
  }

  preparePassengerInfos() {
    const flightFareKey = JSON.parse(this.session.get('flightFareKey'));
    let paxNumber = 1;
    this.form.passengerInfos = this.passengers.map((passenger) => {
      const age = this.calculateAge(passenger.birthdayDate);
      const passengerInfo: IPassengerInfo = {
        paxNumber: paxNumber++,
        title: passenger.title,
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        middleName: '',
        age: age,
        dateOfBirth: DateTime.setTimeZone(passenger.birthdayDate),
        passengerType: passenger.type,
        mobilePhone: passenger.mobilePhone || '',
        gender: this.getGender(passenger.title),
        flightFareKey: flightFareKey.flightFareKey.map(
          (fk: IFlightFareKey) => ({
            fareKey: fk.fareKey,
            journeyKey: fk.journeyKey,
            departureTime: fk.departureTime,
            extraService: [],
            selectedSeat: [],
          })
        ),
      };
      if (passenger.email !== '') {
        passengerInfo.email = passenger.email;
      }
      return passengerInfo;
    });
  }

  getGender(title: string) {
    if (
      title === 'Mr' ||
      title === 'Monk' ||
      title === 'Mstr' ||
      title === 'Boy'
    ) {
      return 'Male';
    } else if (title === 'Mrs' || title === 'Miss' || title === 'Girl') {
      return 'Female';
    } else {
      return 'Unknow';
    }
  }

  calculateAge(dob: Date) {
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }

  updateSummary() {
    this.wait = false;
    const obs = this.booking
      .SubmitBooking(this.form, this.securityToken)
      .subscribe({
        next: (resp) => {
          this.summaryAmount = Number(resp.data!.totalAmount);
          this.wait = true;
          this.session.set('formSubmit', this.form);
          this.session.remove('extraPricing');
          this.session.set('extraPricing', resp);
          this.sharedService.triggerHeaderRefresh();
        },
        error: (error) => {
          this.wait = true;
          this.popup.waring('Sorry, something went wrong.');
          console.log(error);
        },
      });
    this.AddSubscription(obs);
  }

  showBaggage(response: SsrSelection[]) {
    let content = '';
    response.forEach((resp) => {
      content += `${resp.passengerName} select ${resp.ssrCode} in ${resp.flightNumber},\n\n`;
    });
    return content.trim();
  }

  showSeat(response: PassengerSeatSelection[]): string {
    let content = '';
    response.forEach((resp) => {
      content += `${resp.passengerName} Seat: ${resp.seat?.rowNumber}${resp.seat?.seat} (${resp.flightNumber}),\n\n`;
    });
    return content.trim();
  }
}
