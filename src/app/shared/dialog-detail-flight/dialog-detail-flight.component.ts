import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISchedule } from '../../model/flight-schedule';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';

@Component({
  selector: 'app-dialog-detail-flight',
  templateUrl: './dialog-detail-flight.component.html',
  styleUrl: './dialog-detail-flight.component.scss',
})
export class DialogDetailFlightComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  constructor(@Inject(MAT_DIALOG_DATA) public data: ISchedule) {
    super();
  }

  ngOnInit(): void {}
}
