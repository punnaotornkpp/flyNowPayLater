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
  TaxDetails,
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
  taxDetailsByPaxType: TaxDetails[] = [];

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
        this.display = JSON.parse(display).data;
        if (this.display) {
          this.calculateTaxesAndDetails();
        }
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

  showMoreDetailTaxe(show: boolean) {
    if (show) {
      this.showTaxes = false;
    } else {
      this.showTaxes = true;
    }
  }

  getService(fareKey: string): string {
    const parts = fareKey.split(':');
    if (parts.length > 1) {
      switch (parts[1].substring(3, 6)) {
        case 'LIT':
          return 'Nok Lite';
        case 'XTR':
          return 'Nok X-tra';
        case 'MAX':
          return 'Nok Max';
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

  calculateTaxesAndDetails(): void {
    this.totalAirportTax = 0;
    this.totalVAT = 0;
    let taxDetailsMap: { [key: string]: TaxDetails } = {};

    this.display.airlines.forEach((flight) => {
      flight.pricingDetails.forEach((pricingDetail) => {
        const paxType = pricingDetail.paxTypeCode;
        if (!taxDetailsMap[paxType]) {
          taxDetailsMap[paxType] = { paxType, count: 0, AT: 0, VAT: 0 };
        }
        taxDetailsMap[paxType].count = pricingDetail.paxCount;
        pricingDetail.taxesAndFees.forEach((tax) => {
          if (tax.taxCode === 'AT') {
            this.totalAirportTax += parseFloat(tax.amount);
            taxDetailsMap[paxType].AT += parseFloat(tax.amount);
          } else if (tax.taxCode === 'VAT') {
            this.totalVAT += parseFloat(tax.amount);
            taxDetailsMap[paxType].VAT += parseFloat(tax.amount);
          }
        });
      });
    });
    this.taxDetailsByPaxType = Object.values(taxDetailsMap);
  }
}
