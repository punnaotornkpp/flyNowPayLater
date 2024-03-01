import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class StepComponent {
  @Input() page: number = 0;

  isSmallScreen: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: Router
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  redirect(page: number) {
    switch (page) {
      case 1:
        this.route.navigateByUrl('');
        break;
      case 2:
        this.route.navigateByUrl('/select');
        break;
      case 3:
        this.route.navigateByUrl('/passengers');
        break;
      case 4:
        this.route.navigateByUrl('/extras');
        break;
      case 5:
        this.route.navigateByUrl('/payment');
        break;
      default:
        break;
    }
  }
}
