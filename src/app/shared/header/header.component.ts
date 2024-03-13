import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { FlightSearchForm } from '../../model/session.model';
import { SessionStorage } from '../../core/helper/session.helper';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SharedService } from '../../service/shared.service';
import { IFare } from '../../model/flight-schedule';
import {
  IAirlinePricing,
  IFlightFareKey,
  IPRICING,
  IPricingDetail,
  IResponseDetailPricing,
  IResponsePricing,
  ITaxesAndFee,
} from '../../model/pricing-detail.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent extends SubscriptionDestroyer implements OnInit {
  isSmallScreen: boolean = false;
  panelOpenState = false;
  index: boolean = false;
  sessionValue!: FlightSearchForm;
  display!: IResponseDetailPricing;
  flightFareKey!: IPRICING;
  show: boolean = false;
  showTaxes: boolean = false;
  totalAirportTax: number = 0;
  totalVAT: number = 0;
  paxDetails: any = {};

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private router: Router,
    private session: SessionStorage,
    private sharedService: SharedService
  ) {
    super();
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
    this.getSessionValue();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkPath();
      });
  }

  ngOnInit(): void {
    const obs = this.sharedService.refreshHeader$.subscribe(() => {
      this.getSessionValue();
    });
    this.AddSubscription(obs);
  }

  getSessionValue(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('history');
        const display = this.session.get('display') || '';
        const flightFareKey = this.session.get('flightFareKey') || '';
        this.flightFareKey = JSON.parse(flightFareKey);
        // console.log(this.flightFareKey);
        this.display = JSON.parse(display).data;
        // this.calculateSums(this.display.airlines);
        this.sessionValue = JSON.parse(item).form as FlightSearchForm;
      } catch (error) {
        this.router.navigateByUrl('');
      }
    }
  }

  checkPath(): void {
    this.index = this.location.path() === '' || this.location.path() === '/';
  }

  openSearch() {
    const dialogRef = this.dialog.open(SearchComponent, {});
    dialogRef.afterClosed().subscribe(() => {});
  }

  showMoreDetail(show: boolean) {
    if (show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  getService(fareKey: string): string {
    const parts = fareKey.split(':');
    if (parts.length > 1) {
      switch (parts[1].substring(3, 6)) {
        case 'LIT':
          return 'NOK LITE';
        case 'XTR':
          return 'NOK X-TRA';
        case 'MAX':
          return 'NOK MAX';
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  getPriceDetail(priceDetails: IPricingDetail[]): number {
    let totalFareAmount: number = 0;
    priceDetails.forEach((detail) => {
      const fareAmount: number = parseFloat(detail.fareAmount);
      totalFareAmount += fareAmount;
    });
    return totalFareAmount;
  }

  calculateSums(airlines: IAirlinePricing[]): void {
    airlines.forEach((booking) => {
      booking.pricingDetails.forEach((detail) => {
        const paxType = detail.paxTypeCode;
        const paxCount = detail.paxCount;
        this.paxDetails[paxType] = this.paxDetails[paxType] || {
          airportTax: 0,
          VAT: 0,
          count: 0,
          code: '',
        };
        this.paxDetails[paxType].count = paxCount;
        this.paxDetails[paxType].code = paxType;
        detail.taxesAndFees.forEach((tax: ITaxesAndFee) => {
          if (tax.taxCode === 'AT') {
            this.totalAirportTax += parseFloat(tax.amount);
            this.paxDetails[paxType].airportTax += parseFloat(tax.amount);
          } else if (tax.taxCode === 'VAT') {
            this.totalVAT += parseFloat(tax.amount);
            this.paxDetails[paxType].VAT += parseFloat(tax.amount);
          }
        });
      });
    });
    console.log(this.paxDetails);
  }
}
