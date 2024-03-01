import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isSmallScreen: boolean = false;
  panelOpenState = false;
  index: boolean = false;

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private router: Router
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkPath();
      });
  }

  checkPath(): void {
    this.index = this.location.path() === '' || this.location.path() === '/';
  }

  openSearch() {
    const dialogRef = this.dialog.open(SearchComponent, {});

    dialogRef.afterClosed().subscribe(() => {});
  }
}
