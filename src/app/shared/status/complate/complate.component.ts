import { Component, OnInit } from '@angular/core';
import { IResponseSubmit } from '../../../model/submit.model';
import { SessionStorage } from '../../../core/helper/session.helper';
import { ITaxesAndFee } from '../../../model/pricing-detail.model';
import { DateTime } from '../../../core/helper/date.helper';

@Component({
  selector: 'app-complate',
  templateUrl: './complate.component.html',
  styleUrl: './complate.component.scss',
})
export class ComplateComponent implements OnInit {
  response!: IResponseSubmit | null;

  constructor(private session: SessionStorage) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.history) {
      try {
        this.response = history.state.data;
        if (this.response) {
          // this.session.remove('history');
          // this.session.remove('display');
          // this.session.remove('flightFareKey');
          // this.session.remove('passengers');
          // this.session.remove('selectedExtras');
          // this.session.remove('pricing');
          // this.session.remove('extras');
        } else {
          this.response = null;
        }
      } catch (error) {
        this.response = null;
      }
    }
  }

  showSSR(item: ITaxesAndFee) {
    if (
      item.taxCode === 'XTR' ||
      item.taxCode === 'MAX' ||
      item.taxCode === 'LIT'
    ) {
      return item.taxName;
    }
    return '';
  }

  setTimeZone(date: string) {
    const newDate = new Date(date);
    return DateTime.setTimeZone(newDate);
  }
}
