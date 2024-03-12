import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { IFare } from '../../model/flight-schedule';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { SharedService } from '../../service/shared.service';
import { IFlightFareKey } from '../../model/pricing-detail.model';

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
  @Input() check: boolean = false;
  @Input() currentIndex: number = 0;
  @Output() onSelect = new EventEmitter<IFare>();

  internalCheck = false;

  constructor() {
    super();
  }

  ngOnChanges(): void {
    this.internalCheck = false;
  }

  selectFlight(isChecked: boolean) {
    this.check = isChecked; // true
    this.internalCheck = isChecked;
    this.onSelect.emit(this.item);
  }
}
