import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-flight',
  templateUrl: './detail-flight.component.html',
  styleUrl: './detail-flight.component.scss',
})
export class DetailFlightComponent {
  @Input() price: number | undefined;
}
