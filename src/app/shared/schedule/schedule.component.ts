import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  defaultTabIndex: number = 4;
  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0 || event.index === 8) {
      window.location.reload();
    }
  }
}
