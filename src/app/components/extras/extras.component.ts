import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { MOCK_EXTRAS } from '../../../assets/language/mock.extras';
import { PopupService } from '../../service/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { ExtraSelectionSeatComponent } from '../../shared/extra-selection-seat/extra-selection-seat.component';
import { ExtraBaggageComponent } from '../../shared/extra-baggage/extra-baggage.component';
import { ExtraSpecialBaggageComponent } from '../../shared/extra-special-baggage/extra-special-baggage.component';
import {
  DialogConfig,
  PassengerSeatSelection,
  SsrSelection,
} from '../../model/extras.model';
import {
  IAvailableExtraService,
  IFlightFareKey,
  IPRICING,
  IResponsePricing,
  ISSR,
  ISeat,
} from '../../model/pricing-detail.model';
import { BookingService } from '../../service/booking.service';
import {
  IAdult,
  IChildren,
  IDisplayPassenger,
  IInfant,
  IPassengerInfo,
} from '../../model/passenger.model';
import { DateTime } from '../../core/helper/date.helper';
import { SharedService } from '../../service/shared.service';
import { IPaymentSubmit } from '../../model/submit.model';

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
  dialogConfig!: DialogConfig;
  ssrBaggage: IAvailableExtraService[] = [];
  form: IPaymentSubmit = {
    actionType: 'summary',
    paymentMethod: '',
    passengerInfos: [],
  };
  defaultSeat!: PassengerSeatSelection[];
  defaultBaggage!: SsrSelection[];
  summaryAmount: number = 0;

  securityToken: string = '';
  extraContent: any;
  extraPricing: any;
  flightFareKey: any;
  pricing!: IResponsePricing;
  passengers: IDisplayPassenger[] = [];
  extras: any;

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
        this.securityToken = this.session.parseSessionData('securityToken', '');
        this.extraContent = this.session.parseSessionData('extraContent');
        this.extraPricing = this.session.parseSessionData('extraPricing');
        this.flightFareKey = this.session.parseSessionData('flightFareKey');
        this.pricing = this.session.parseSessionData('pricing');
        this.passengers = this.preparePassengers(
          this.session.parseSessionData('passengers')
        );
        this.extras = this.session.parseSessionData('extras');
        let form = this.session.parseSessionData('formSubmit');

        this.initializeSummaryExtras();
        if (this.extraContent) {
          this.items = this.extraContent.items;
          this.defaultSeat = this.extraContent.seat;
          this.defaultBaggage = this.extraContent.baggage;
        }
        if (this.extras) {
          this.ssr = this.extras.ssr;
          this.seat = this.extras.seat;
          this.setState();
          if (form) {
            this.form = form;
          } else {
            this.session.set('formSubmit', this.form);
          }
        } else {
          await Promise.all([
            this.getSSR(this.flightFareKey, this.securityToken),
            this.getSeats(this.flightFareKey, this.securityToken),
          ]);
          this.session.set('extras', {
            ssr: this.ssr,
            seat: this.seat,
          });
          this.setState();
          if (form) {
            this.form = form;
          } else {
            this.session.set('formSubmit', this.form);
          }
        }
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  setState() {
    this.spinner = true;
    this.loading = true;
    this.setDialog();
    this.preparePassengerInfos();
  }

  initializeSummaryExtras(): void {
    this.summaryAmount = this.extraPricing
      ? Number(this.extraPricing.data.totalAmount)
      : Number(this.pricing.data.totalAmount);
  }

  initializeSessionData(): void {}

  preparePassengers(data: any): IDisplayPassenger[] {
    const adults: IDisplayPassenger[] = data.adults.map((p: IAdult) => ({
      ...p,
      type: 'Adult',
    }));
    const children: IDisplayPassenger[] = data.children.map((p: IChildren) => ({
      ...p,
      type: 'Child',
    }));
    const infants: IDisplayPassenger[] = data.infants.map((p: IInfant) => ({
      ...p,
      type: 'Infant',
    }));
    return [...adults, ...children, ...infants];
  }

  setDialog() {
    this.dialogConfig = {
      0: {
        component: ExtraSelectionSeatComponent,
        width: '90vw',
        height: '95vh',
        maxWidth: '90vw',
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
            }
          }
        );
    } else {
      this.popup.info('There are no details on this extra service.');
    }
  }

  setStatus(id: number, resp: { status: boolean; response: []; type: number }) {
    const getContentAndTitle = () => {
      if (resp.status) {
        switch (resp.type) {
          case 0:
            return { content: `${this.showSeat(resp.response)}`, title: '' };
          case 1:
            return { content: `${this.showBaggage(resp.response)}`, title: '' };
          default:
            return {
              content: this.items[id].content,
              title: this.items[id].detail.title,
            };
        }
      } else {
        const defaultContent = MOCK_EXTRAS;
        return {
          content: defaultContent[id].content,
          title: defaultContent[id].detail.title,
        };
      }
    };
    const { content, title } = getContentAndTitle();
    const updatedItem = {
      ...this.items[id],
      status: resp.status,
      content,
      detail: { ...this.items[id].detail, title },
    };
    this.items = [
      ...this.items.slice(0, id),
      updatedItem,
      ...this.items.slice(id + 1),
    ];
    if (resp.type === 0) {
      this.updateSeat(resp.response);
    } else if (resp.type === 1) {
      this.updateBaggage(resp.response);
    }
  }

  updateSeat(resp: PassengerSeatSelection[]) {
    this.defaultSeat = resp;
    this.setDialog();
    if (Array.isArray(resp) && resp.length === 0) {
      this.form.passengerInfos.forEach((passenger: any) => {
        passenger.flightFareKey.forEach((flight: any) => {
          flight.selectedSeat = [];
        });
      });
      this.updateSummary(false);
      return;
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
    this.updateSummary(true);
  }

  updateBaggage(resp: SsrSelection[]) {
    this.defaultBaggage = resp;
    this.setDialog();
    if (Array.isArray(resp) && resp.length === 0) {
      this.form.passengerInfos.forEach((passenger: any) => {
        passenger.flightFareKey.forEach((flight: any) => {
          flight.extraService = [];
        });
      });
      this.updateSummary(false);
      return;
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
    this.updateSummary(true);
  }

  preparePassengerInfos() {
    const flightFareKey = this.session.parseSessionData('flightFareKey');
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
      title === 'MR' ||
      title === 'MONK' ||
      title === 'MSTR' ||
      title === 'BOY'
    ) {
      return 'Male';
    } else if (title === 'MRS' || title === 'MISS' || title === 'GIRL') {
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

  updateSummary(status: boolean) {
    this.wait = false;
    const obs = this.booking
      .submitBooking(this.form, this.securityToken)
      .subscribe({
        next: (resp) => {
          if (status) {
            this.popup.success('Add extra service success.');
          } else {
            this.popup.success('Cancel extra service success.');
          }
          this.summaryAmount = Number(resp.data!.totalAmount);
          this.wait = true;
          this.session.set('formSubmit', this.form);
          this.session.remove('extraPricing');
          this.session.set('extraPricing', resp);
          this.session.set('extraContent', {
            items: this.items,
            seat: this.defaultSeat,
            baggage: this.defaultBaggage,
          });
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
