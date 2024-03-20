import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  IAirlinePricing,
  IAvailableExtraService,
  IBundleDetails,
  IResponseDetailPricing,
  IVat,
} from '../../model/pricing-detail.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDispalyPassenger } from '../../model/passenger.model';
import { ExtrasComponent } from '../../components/extras/extras.component';

interface SsrSelection {
  passengerName: string;
  ssrCode: string;
  flightNumber: string;
  passengerIndex: number;
  airlineIndex: number;
  amount: number;
}

export interface SsrOption {
  ssrCode: string;
  description: string;
  amount?: string;
  currency?: string;
  flightNumber: string;
  paxTypeCode?: string;
  vat?: IVat[];
}

@Component({
  selector: 'app-extra-baggage',
  templateUrl: './extra-baggage.component.html',
  styleUrl: './extra-baggage.component.scss',
})
export class ExtraBaggageComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  ssrSelections: SsrSelection[] = [];
  filteredSsrOptions: SsrOption[] = [];
  initialValue: SsrOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<ExtrasComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pricing: IResponseDetailPricing;
      passengers: IDispalyPassenger[];
      ssr: IAvailableExtraService[];
    }
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.prepareFilteredSsrOptions();
  }

  getSsrOptionsForFlight(flightNumber: string): SsrOption[] {
    return this.filteredSsrOptions.filter(
      (ssr) => ssr.flightNumber === flightNumber
    );
  }

  prepareFilteredSsrOptions() {
    const ssrCodes = ['BG05', 'BG10', 'BG15', 'BG20', 'BG25', 'BG30', 'BG40'];
    const ssrInitialCodes = ['BB25', 'BB15'];
    this.filteredSsrOptions = [];
    this.data.pricing.airlines.forEach((airline) => {
      const flightNumber = airline.travelInfos[0].flightNumber;
      const flightSsrOptions = this.data.ssr
        .filter(
          (ssr) =>
            ssrCodes.includes(ssr.ssrCode) && ssr.flightNumber === flightNumber
        )
        .sort(
          (a, b) => ssrCodes.indexOf(a.ssrCode) - ssrCodes.indexOf(b.ssrCode)
        )
        .map((ssr) => ({
          ...ssr,
          flightNumber,
        }));
      this.filteredSsrOptions.push(...flightSsrOptions);
    });
  }

  onSsrSelection(
    ssrCode: string,
    flightNumber: string,
    passengerIndex: number,
    airlineIndex: number
  ) {
    console.log(ssrCode);
    if (ssrCode === null) {
    }
    const selectedSsr = this.data.ssr.find(
      (ssr: { ssrCode: string }) => ssr.ssrCode === ssrCode
    );
    if (selectedSsr) {
      this.ssrSelections.push({
        passengerName:
          this.data.passengers[passengerIndex].firstName +
          ' ' +
          this.data.passengers[passengerIndex].lastName,
        ssrCode: ssrCode,
        flightNumber: flightNumber,
        passengerIndex: passengerIndex,
        airlineIndex: airlineIndex,
        amount: parseFloat(selectedSsr.amount),
      });
    }
  }

  getTitle(index: number) {
    if (index === 0) {
      return 'Depart';
    }
    return 'Return';
  }

  getBundleInfo(bundleDetails: IBundleDetails[]): {
    bundleName: string;
    baggageInfo: string;
  } {
    let bundleInfo = {
      bundleName: 'Nok Lite',
      baggageInfo: 'No baggage allowance included',
    };
    const hasXtra = bundleDetails.some(
      (detail) =>
        detail.ssrCode === 'XTR' || detail.description.includes('X-TRA')
    );
    const hasMax = bundleDetails.some((detail) => detail.ssrCode === 'MAX');

    if (hasXtra) {
      bundleInfo = {
        bundleName: 'Nok X-Tra',
        baggageInfo:
          '15kg. Checked baggage allowance for domestic flight / 20kg. Checked baggage allowance for international flight included',
      };
    } else if (hasMax) {
      bundleInfo = {
        bundleName: 'Nok Max',
        baggageInfo:
          '25kg. Checked baggage allowance for domestic flight / 30kg. Checked baggage allowance for international flight included',
      };
    }
    return bundleInfo;
  }

  Cancel() {
    this.dialogRef.close({ status: false, response: '' });
  }

  Confirm() {
    this.dialogRef.close({ status: false, response: this.ssrSelections });
  }

  getSumAmountByAirline(airlineIndex: number): number {
    const passengerAmounts = new Map();
    this.ssrSelections.forEach((selection) => {
      if (selection.airlineIndex === airlineIndex) {
        const key = `passenger-${selection.passengerIndex}`;
        passengerAmounts.set(key, selection.amount);
      }
    });
    let totalAmount = 0;
    passengerAmounts.forEach((amount) => {
      totalAmount += amount;
    });
    return totalAmount;
  }
}
