import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { FlightSearchForm } from '../../model/session.model';
import { SessionStorage } from '../../core/helper/session.helper';
import { SubscriptionDestroyer } from '../../core/helper/subscriptionDestroyer.helper';
import { SharedService } from '../../service/shared.service';
import { IFare } from '../../model/flight-schedule';
import {
  IFlightFareKey,
  IResponseDetailPricing,
  IResponsePricing,
} from '../../model/pricing-detail.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent extends SubscriptionDestroyer implements OnInit {
  isSmallScreen: boolean = false;
  panelOpenState = false;
  index: boolean = false;
  sessionValue!: FlightSearchForm;
  display!: IResponseDetailPricing;
  flightFareKey!: IFlightFareKey;
  show: boolean = true;

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private router: Router,
    private session: SessionStorage,
    private sharedService: SharedService
  ) {
    super();
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
    this.getSessionValue();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkPath();
      });
  }

  ngOnInit(): void {
    const obs = this.sharedService.refreshHeader$.subscribe(() => {
      this.getSessionValue();
    });
    this.AddSubscription(obs);
  }

  getSessionValue(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = this.session.get('history');
        const display = this.session.get('display') || '';
        const flightFareKey = this.session.get('flightFareKey') || '';
        this.display = JSON.parse(display).data;
        console.log(this.display);
        this.sessionValue = JSON.parse(item).form as FlightSearchForm;
      } catch (error) {
        this.router.navigateByUrl('');
      }
    }
  }

  checkPath(): void {
    this.index = this.location.path() === '' || this.location.path() === '/';
  }

  openSearch() {
    const dialogRef = this.dialog.open(SearchComponent, {});
    dialogRef.afterClosed().subscribe(() => {});
  }

  showMoreDetail(show: boolean) {
    if (show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }
}
