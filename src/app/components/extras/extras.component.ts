import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SessionStorage } from '../../core/helper/session.helper';
import { MOCK_EXTRAS } from '../../../assets/mock.extras';
import { PopupService } from '../../service/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { ExtraSelectionSeatComponent } from '../../shared/extra-selection-seat/extra-selection-seat.component';
import { ExtraBaggageComponent } from '../../shared/extra-baggage/extra-baggage.component';
import { ExtraSpecialBaggageComponent } from '../../shared/extra-special-baggage/extra-special-baggage.component';
import { DialogConfig } from '../../model/extras.model';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss',
})
export class ExtrasComponent extends SubscriptionDestroyer implements OnInit {
  items = MOCK_EXTRAS;

  constructor(
    private route: Router,
    private session: SessionStorage,
    private popup: PopupService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('history');
        console.log(JSON.parse(item).form);
      } catch (error) {
        this.route.navigateByUrl('');
      }
    }
  }

  redirectPrevious() {
    this.route.navigateByUrl('passengers');
  }

  redirectNext() {
    this.route.navigateByUrl('payment');
  }

  private dialogConfig: DialogConfig = {
    0: {
      component: ExtraSelectionSeatComponent,
      width: '1000px',
      height: '500px',
      data: '',
    },
    1: {
      component: ExtraBaggageComponent,
      width: '1000px',
      height: '500px',
      data: '',
    },
    2: {
      component: ExtraSpecialBaggageComponent,
      width: '1000px',
      height: '500px',
      data: '',
    },
  };

  openDialog(id: number): void {
    const config = this.dialogConfig[id];
    if (config) {
      const { component, ...options } = config;
      const dialogRef = this.dialog.open(component, options);
      dialogRef.afterClosed().subscribe((resp) => {
        this.setStatus(id, resp);
      });
    } else {
      this.popup.info('There are no details on this extra service.');
    }
  }

  setStatus(id: number, resp: string) {
    this.items[id].status = true;
    this.items[id].content = resp;
    this.items[id].detail.title = '';
  }
}
