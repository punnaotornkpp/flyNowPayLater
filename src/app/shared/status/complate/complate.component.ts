import { Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';

@Component({
  selector: 'app-complate',
  templateUrl: './complate.component.html',
  styleUrl: './complate.component.scss',
})
export class ComplateComponent implements OnInit {
  data: any;
  constructor(private router: Router) {}

  ngOnInit() {
    const currentNavigation: Navigation | null =
      this.router.getCurrentNavigation();
    if (currentNavigation) {
      const state = currentNavigation.extras.state;
      if (state && 'data' in state) {
        this.data = state['data'];
        console.log(this.data);
      }
    }
  }
}
