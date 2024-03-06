import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-detail-flight',
  templateUrl: './dialog-detail-flight.component.html',
  styleUrl: './dialog-detail-flight.component.scss',
})
export class DialogDetailFlightComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {}
}
