import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import {
  IBundleDetails,
  IResponseDetailPricing,
} from '../../model/pricing-detail.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-extra-baggage',
  templateUrl: './extra-baggage.component.html',
  styleUrl: './extra-baggage.component.scss',
})
export class ExtraBaggageComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  constructor(@Inject(MAT_DIALOG_DATA) public data: IResponseDetailPricing) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  getTitle(index: number) {
    if (index === 0) {
      return 'Depart';
    }
    return 'Return';
  }

  getBundleName(bundleDetails: IBundleDetails[]) {}
}
