import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
  implements OnChanges, OnInit
{
  @Input() item!: IFare;
  @Input() check: boolean = false;
  @Input() currentIndex: number = 0;
  @Input() isSelected: boolean = false;
  @Output() onSelect = new EventEmitter<IFare>();

  internalCheck: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.internalCheck = this.isSelected;
  }

  selectFlight(isChecked: boolean) {
    this.check = isChecked; // true
    this.internalCheck = isChecked;
    this.onSelect.emit(this.item);
  }
}
