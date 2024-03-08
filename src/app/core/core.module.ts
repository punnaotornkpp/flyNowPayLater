import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransformDateToTimePipe } from './pipe/transform-date-to-time.pipe';
import { DecimalFloatPipe } from './pipe/decimal-float.pipe';

@NgModule({
  declarations: [TransformDateToTimePipe, DecimalFloatPipe],
  imports: [CommonModule],
  exports: [TransformDateToTimePipe, DecimalFloatPipe],
})
export class CoreModule {}
