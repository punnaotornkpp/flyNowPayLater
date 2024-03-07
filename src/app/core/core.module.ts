import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransformDateToTimePipe } from './pipe/transform-date-to-time.pipe';

@NgModule({
  declarations: [TransformDateToTimePipe],
  imports: [CommonModule],
  exports: [TransformDateToTimePipe],
})
export class CoreModule {}
