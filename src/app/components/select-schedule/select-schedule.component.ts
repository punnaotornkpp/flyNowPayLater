import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';

@Component({
  selector: 'app-select-schedule',
  templateUrl: './select-schedule.component.html',
  styleUrl: './select-schedule.component.scss',
})
export class SelectScheduleComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  saveValue: any;
  constructor(private session: SessionStorage) {
    super();
  }

  ngOnInit(): void {
    const saveValue = JSON.parse(this.session.get('data'));
    console.log(saveValue.form);
    this.saveValue = saveValue.form;
  }
}
