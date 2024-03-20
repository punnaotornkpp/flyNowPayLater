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
import { ExtraBaggageComponent } from '../../shared/extra-baggage/extra-baggage.component';
import { ExtraSpecialBaggageComponent } from '../../shared/extra-special-baggage/extra-special-baggage.component';
import { DialogConfig } from '../../model/extras.model';
import {
  IAvailableExtraService,
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
} from '../../model/passenger.model';

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
  pricing!: IResponsePricing;
  passengers: IDispalyPassenger[] = [];
  dialogConfig!: DialogConfig;
  ssrBaggage: IAvailableExtraService[] = [];

  constructor(
    private route: Router,
    private session: SessionStorage,
    private popup: PopupService,
    private dialog: MatDialog,
    private booking: BookingService
  ) {
    super();
  }

  async ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        this.session.set('selectedExtras', '');
        const securityToken =
          JSON.parse(this.session.get('schedule')).securityToken || '';
        const flightFareKey: IPRICING = JSON.parse(
          this.session.get('flightFareKey')
        );
        this.pricing = JSON.parse(this.session.get('pricing'));
        const passengers = JSON.parse(this.session.get('passengers'));
        this.passengers = [
          ...passengers.adults.map((p: IAdult[]) => ({ ...p, type: 'Adult' })),
          ...passengers.children.map((p: IChildren[]) => ({
            ...p,
            type: 'Child',
          })),
          // ...passengers.infants.map((p: IInfant[]) => ({
          //   ...p,
          //   type: 'Infant',
          // })),
        ];
        const extras = JSON.parse(this.session.get('extras'));
        if (extras) {
          this.ssr = extras.ssr;
          this.seat = extras.seat;
          console.log(this.ssr);
          this.setDialog();
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
        width: '95vw',
        height: '95vh',
        maxWidth: '95vw',
        data: {
          pricing: this.pricing.data,
          passengers: this.passengers,
          seats: this.seat,
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
          (resp: { status: boolean; response: PassengerSeatSelection[] }) => {
            this.setStatus(id, resp);
            this.session.set('selectedExtras', resp);
          }
        );
    } else {
      this.popup.info('There are no details on this extra service.');
    }
  }

  setStatus(
    id: number,
    resp: { status: boolean; response: PassengerSeatSelection[] }
  ) {
    this.items[id].status = resp.status;
    this.items[id].content = JSON.stringify(resp.response);
    this.items[id].detail.title = '';
  }
}
