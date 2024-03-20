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
    const currentNavigation = this.router.getCurrentNavigation();
    this.data = currentNavigation?.extras.state?.['data'];
    console.log(this.data);
  }
}
