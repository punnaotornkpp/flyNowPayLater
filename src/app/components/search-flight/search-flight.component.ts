import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-flight',
  templateUrl: './search-flight.component.html',
  styleUrl: './search-flight.component.scss',
})
export class SearchFlightComponent {
  constructor() {}
  colorControl = new FormControl();
}
