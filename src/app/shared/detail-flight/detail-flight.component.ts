import { Component, Input, OnChanges } from '@angular/core';
import { IFare } from '../../model/flight-schedule';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-detail-flight',
  templateUrl: './detail-flight.component.html',
  styleUrl: './detail-flight.component.scss',
})
export class DetailFlightComponent
  extends SubscriptionDestroyer
  implements OnChanges
{
  @Input() item!: IFare;
  @Input() check = false;
  internalCheck = false;
  constructor(
    private session: SessionStorage,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnChanges(): void {
    if (this.internalCheck === this.check) {
      this.internalCheck = false;
    } else {
      this.internalCheck = true;
    }
  }

  selectFlight() {
    this.check = true;
    this.internalCheck = this.check;
    this.session.set('display', this.item);
    this.sharedService.triggerHeaderRefresh();
  }
}
