import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  IAvailableExtraService,
  IBundleDetails,
  IResponseDetailPricing,
} from '../../model/pricing-detail.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDisplayPassenger } from '../../model/passenger.model';
import { ExtrasComponent } from '../../components/extras/extras.component';
import { SsrSelection, SsrOption, BundleInfo } from '../../model/extras.model';

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
  selectedOptions: {
    [passengerIndex: number]: { [flightNumber: string]: string };
  } = {};

  title: string[] = [];
  bundleInfos: BundleInfo[] = [];
  totalAmountsByAirline: number[] = [];
  filteredPassengers: IDisplayPassenger[] = [];
  ssrOptionsByFlight: { [key: string]: SsrOption[] } = {};
  initialSsrOptionsByFlight: { [key: string]: SsrOption[] } = {};

  constructor(
    public dialogRef: MatDialogRef<ExtrasComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pricing: IResponseDetailPricing;
      passengers: IDisplayPassenger[];
      ssr: IAvailableExtraService[];
      selected: SsrSelection[];
    }
  ) {
    super();
  }

  ngOnInit(): void {
    this.filteredPassengers = this.checkInfant(this.data.passengers);
    this.prepareFilteredSsrOptions();
    this.prepareSsrOptions();
    if (this.data.selected && this.data.selected.length > 0) {
      this.ssrSelections = this.data.selected;
      this.applySelectedOptions();
    } else {
      this.applyDefaultOptions();
    }
  }

  prepareSsrOptions(): void {
    this.ssrOptionsByFlight = {};
    this.initialSsrOptionsByFlight = {};
    this.data.pricing.airlines.forEach((airline, index) => {
      this.totalAmountsByAirline[index] = this.getSumAmountByAirline(index);
      this.title[index] = this.getTitle(index);
      this.bundleInfos[index] = this.getBundleInfo(airline.bundleDetails);
      const flightNumber = airline.travelInfos[0].flightNumber;
      this.initialSsrOptionsByFlight[flightNumber] =
        this.getSsrOptionsForFlightInit(flightNumber);
    });
  }

  getSsrOptionsForFlight(
    flightNumber: string,
    passengerType: string
  ): SsrOption[] {
    let paxTypeCode = '';
    switch (passengerType) {
      case 'Adult':
        paxTypeCode = 'ADT';
        break;
      case 'Child':
        paxTypeCode = 'CHD';
        break;
      case 'Infant':
        paxTypeCode = 'INF';
        break;
    }
    return this.filteredSsrOptions.filter(
      (ssr) =>
        ssr.flightNumber === flightNumber && ssr.paxTypeCode === paxTypeCode
    );
  }

  getSsrOptionsForFlightInit(flightNumber: string): SsrOption[] {
    return this.initialValue.filter((ssr) => ssr.flightNumber === flightNumber);
  }

  applySelectedOptions(): void {
    this.data.passengers.forEach((passenger, passengerIndex) => {
      this.data.pricing.airlines.forEach((airline) => {
        const flightNumber = airline.travelInfos[0].flightNumber;
        const selectedOption = this.data.selected.find(
          (option) =>
            option.passengerIndex === passengerIndex &&
            option.flightNumber === flightNumber
        );
        if (selectedOption) {
          const { ssrCode } = selectedOption;
          this.updateSelectedOption(passengerIndex, flightNumber, ssrCode);
        } else {
          this.setDefaultSelectionForPassenger(flightNumber, passengerIndex);
        }
      });
    });
  }

  applyDefaultOptions(): void {
    this.data.pricing.airlines.forEach((airline) => {
      const flightNumber = airline.travelInfos[0].flightNumber;
      this.data.passengers.forEach((passenger, passengerIndex) => {
        this.setDefaultSelectionForPassenger(flightNumber, passengerIndex);
      });
    });
  }

  updateTotalAmounts(): void {
    this.totalAmountsByAirline = this.data.pricing.airlines.map((_, index) =>
      this.getSumAmountByAirline(index)
    );
  }

  setDefaultSelectionForPassenger(
    flightNumber: string,
    passengerIndex: number
  ): void {
    const initOptions = this.getSsrOptionsForFlightInit(flightNumber);
    if (initOptions.length > 0) {
      const ssrCode = initOptions[0].ssrCode;
      this.updateSelectedOption(passengerIndex, flightNumber, ssrCode);
    }
  }

  updateSelectedOption(
    passengerIndex: number,
    flightNumber: string,
    ssrCode: string
  ): void {
    if (!this.selectedOptions[passengerIndex]) {
      this.selectedOptions[passengerIndex] = {};
    }
    this.selectedOptions[passengerIndex][flightNumber] = ssrCode;
  }

  getSelectedOption(
    passengerIndex: number,
    flightNumber: string
  ): string | null {
    return this.selectedOptions[passengerIndex]?.[flightNumber] || null;
  }

  prepareFilteredSsrOptions() {
    const ssrCodes = ['BG05', 'BG10', 'BG15', 'BG20', 'BG25', 'BG30', 'BG40'];
    const ssrInitialCodes = ['BB25', 'BB15'];
    this.filteredSsrOptions = [];
    this.initialValue = [];
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
      const flightSsrOptionInit = airline.bundleDetails
        .filter((ssr) => ssrInitialCodes.includes(ssr.ssrCode))
        .map((ssr) => ({
          ...ssr,
          flightNumber,
        }));
      this.initialValue.push(...flightSsrOptionInit);
      this.filteredSsrOptions.push(...flightSsrOptions);
    });
  }

  onSsrSelection(
    ssrCode: string | null,
    flightNumber: string,
    passengerIndex: number,
    airlineIndex: number
  ) {
    if (!ssrCode || ssrCode === 'BB15' || ssrCode === 'BB25') {
      this.ssrSelections = this.ssrSelections.filter(
        (selection) =>
          !(
            selection.passengerIndex === passengerIndex &&
            selection.airlineIndex === airlineIndex
          )
      );
      this.updateTotalAmounts();
      return;
    }
    const selectedSsr = this.data.ssr.find((ssr) => ssr.ssrCode === ssrCode);
    if (selectedSsr) {
      const passenger = this.data.passengers[passengerIndex];
      const passengerName = `${passenger.firstName} ${passenger.lastName}`;
      const amount = parseFloat(selectedSsr.amount);
      const existingSelection = this.ssrSelections.find(
        (selection) =>
          selection.passengerIndex === passengerIndex &&
          selection.airlineIndex === airlineIndex
      );
      const newSelection: SsrSelection = {
        passengerName,
        ssrCode,
        flightNumber,
        passengerIndex,
        airlineIndex,
        amount,
      };
      if (existingSelection) {
        Object.assign(existingSelection, newSelection);
      } else {
        this.ssrSelections.push(newSelection);
      }
    }
    this.updateTotalAmounts();
  }

  checkInfant(passengers: IDisplayPassenger[]) {
    const filteredPassengers = passengers.filter(
      (passenger) => passenger.type !== 'Infant'
    );
    return filteredPassengers;
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
    this.dialogRef.close({ status: false, response: [], type: 1 });
  }

  Confirm() {
    let status = false;
    if (this.ssrSelections && this.ssrSelections.length > 0) {
      status = true;
    }
    this.dialogRef.close({
      status: status,
      response: this.ssrSelections,
      type: 1,
    });
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
