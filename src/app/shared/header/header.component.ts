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
import {
  IPRICING,
  IPricingDetail,
  IResponseDetailPricing,
  TaxDetails,
} from '../../model/pricing-detail.model';
import { IResponseSubmit } from '../../model/submit.model';
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
  extraPricing!: IResponseSubmit;
  check!: IResponseSubmit; ////
  totalExtra = [
    { amount: 0, taxName: '', taxCode: 'BG05' },
    { amount: 0, taxName: '', taxCode: 'BG10' },
    { amount: 0, taxName: '', taxCode: 'BG15' },
    { amount: 0, taxName: '', taxCode: 'BG20' },
    { amount: 0, taxName: '', taxCode: 'BG25' },
    { amount: 0, taxName: '', taxCode: 'BG30' },
    { amount: 0, taxName: '', taxCode: 'BG40' },
    { amount: 0, taxName: '', taxCode: 'S500' },
    { amount: 0, taxName: '', taxCode: 'S300' },
    { amount: 0, taxName: '', taxCode: 'S150' },
  ];

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
        const extraPricing = this.session.get('extraPricing') || '';
        this.extraPricing = JSON.parse(extraPricing);
        this.flightFareKey = JSON.parse(flightFareKey);
        this.display = JSON.parse(display).data;
        if (this.display) {
          this.totalAirportTax = 0;
          this.totalVAT = 0;
          this.totalExtra = [
            { amount: 0, taxName: '', taxCode: 'BG05' },
            { amount: 0, taxName: '', taxCode: 'BG10' },
            { amount: 0, taxName: '', taxCode: 'BG15' },
            { amount: 0, taxName: '', taxCode: 'BG20' },
            { amount: 0, taxName: '', taxCode: 'BG25' },
            { amount: 0, taxName: '', taxCode: 'BG30' },
            { amount: 0, taxName: '', taxCode: 'BG40' },
            { amount: 0, taxName: '', taxCode: 'S500' },
            { amount: 0, taxName: '', taxCode: 'S300' },
            { amount: 0, taxName: '', taxCode: 'S150' },
          ];
          if (this.extraPricing) {
            this.calculateTaxesAndDetailsSummary();
          } else {
            this.totalAmount(this.display.totalAmount);
            this.calculateTaxesAndDetails();
          }
        }
        this.sessionValue = JSON.parse(item).form as FlightSearchForm;
      } catch (error) {
        this.router.navigateByUrl('');
      }
    }
  }

  totalAmount(totalAmount: string) {
    if (this.extraPricing) {
      return this.extraPricing.data.totalAmount;
    }
    return totalAmount;
  }

  checkPath(): void {
    this.index =
      this.location.path() === '' ||
      this.location.path() === '/' ||
      this.location.path() === '/payment/complate';
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

  calculateTaxesAndDetailsSummary(): void {
    let taxDetailsMap: { [key: string]: TaxDetails } = {};
    let extraPricing = this.extraPricing.data;
    extraPricing.airlines.sort((a, b) => {
      return (
        new Date(a.departureTime).getTime() -
        new Date(b.departureTime).getTime()
      );
    });
    extraPricing.airlines.forEach((flight) => {
      flight.passengerDetails.forEach((passengerDetail) => {
        const pricingDetail = passengerDetail.pricingDetails;
        const paxType = passengerDetail.passengerType;
        if (!taxDetailsMap[paxType]) {
          taxDetailsMap[paxType] = { paxType, count: 0, AT: 0, VAT: 0 };
        }
        taxDetailsMap[paxType].count += 1;
        pricingDetail.taxesAndFees.forEach((tax) => {
          if (tax.taxCode === 'AT') {
            this.totalAirportTax += parseFloat(tax.amount);
            taxDetailsMap[paxType].AT += parseFloat(tax.amount);
          } else if (tax.taxCode === 'VAT') {
            this.totalVAT += parseFloat(tax.amount);
            taxDetailsMap[paxType].VAT += parseFloat(tax.amount);
          }
          this.totalExtra.forEach((taxItem) => {
            if (tax.taxCode === taxItem.taxCode) {
              taxItem.amount += parseFloat(tax.amount);
              taxItem.taxName = tax.taxName;
            }
          });
        });
      });
    });
    this.taxDetailsByPaxType = Object.values(taxDetailsMap);
  }

  calculateTaxesAndDetails(): void {
    let taxDetailsMap: { [key: string]: TaxDetails } = {};
    this.display.airlines.sort((a, b) => {
      return (
        new Date(a.departureTime).getTime() -
        new Date(b.departureTime).getTime()
      );
    });
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
