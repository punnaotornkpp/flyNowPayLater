import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { MOCK_EXTRAS } from '../../../assets/mock.extras';
import { PopupService } from '../../service/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { ExtraSelectionSeatComponent } from '../../shared/extra-selection-seat/extra-selection-seat.component';
import { ExtraBaggageComponent } from '../../shared/extra-baggage/extra-baggage.component';
import { ExtraSpecialBaggageComponent } from '../../shared/extra-special-baggage/extra-special-baggage.component';
import { DialogConfig } from '../../model/extras.model';
import {
  IFlightFareKey,
  IPRICING,
  IResponseDetailPricing,
  ISSR,
  ISeat,
} from '../../model/pricing-detail.model';
import { BookingService } from '../../service/booking.service';

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

  constructor(
    private route: Router,
    private session: SessionStorage,
    private popup: PopupService,
    private dialog: MatDialog,
    private booking: BookingService
  ) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const securityToken =
          JSON.parse(this.session.get('schedule')).securityToken || '';
        const flightFareKey: IPRICING = JSON.parse(
          this.session.get('flightFareKey')
        );
        const pricing: IResponseDetailPricing = JSON.parse(
          this.session.get('pricing')
        );
        console.log(pricing);
        const extras = JSON.parse(this.session.get('extras'));
        if (extras) {
          this.ssr = extras.ssr;
          this.seat = extras.seat;
          this.spinner = true;
          this.loading = true;
        } else {
          this.getSSR(flightFareKey, securityToken);
        }
        console.log(this.seat);
        console.log(this.ssr);
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  getSSR(flightFareKey: IPRICING, securityToken: string) {
    const obs = this.booking
      .getSSR(flightFareKey, securityToken)
      .subscribe((resp) => {
        this.ssr = resp.data;
        this.getSeats(flightFareKey, securityToken);
      });
    this.AddSubscription(obs);
  }

  getSeats(flightFareKey: IPRICING, securityToken: string) {
    const obs = this.booking
      .getSeat(flightFareKey.flightFareKey[0], securityToken)
      .subscribe((resp) => {
        this.seat = resp;
        this.session.set('extras', { ssr: this.ssr, seat: this.seat });
        this.spinner = true;
        this.loading = true;
      });
    this.AddSubscription(obs);
  }

  redirectPrevious() {
    this.route.navigateByUrl('passengers');
  }

  redirectNext() {
    this.route.navigateByUrl('payment');
  }

  private dialogConfig: DialogConfig = {
    0: {
      component: ExtraSelectionSeatComponent,
      width: '95vw',
      height: '95vh',
      maxWidth: '95vw',
      data: '',
    },
    1: {
      component: ExtraBaggageComponent,
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      data: '',
    },
    2: {
      component: ExtraSpecialBaggageComponent,
      width: '1000px',
      height: '500px',
      data: '',
    },
  };

  openDialog(id: number): void {
    const config = this.dialogConfig[id];
    if (config) {
      const { component, ...options } = config;
      const dialogRef = this.dialog.open(component, options);
      dialogRef.afterClosed().subscribe((resp) => {
        this.setStatus(id, resp);
      });
    } else {
      this.popup.info('There are no details on this extra service.');
    }
  }

  setStatus(id: number, resp: string) {
    this.items[id].status = true;
    this.items[id].content = resp;
    this.items[id].detail.title = '';
  }
}
