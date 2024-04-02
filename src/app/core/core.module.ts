import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransformDateToTimePipe } from './pipe/transform-date-to-time.pipe';
import { DecimalFloatPipe } from './pipe/decimal-float.pipe';
import { NumberInputDirective } from './directive/numberInput.directive';

@NgModule({
  declarations: [
    TransformDateToTimePipe,
    DecimalFloatPipe,
    NumberInputDirective,
  ],
  imports: [CommonModule],
  exports: [TransformDateToTimePipe, DecimalFloatPipe, NumberInputDirective],
})
export class CoreModule {}
