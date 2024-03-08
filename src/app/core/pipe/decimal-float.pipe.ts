import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFloat',
})
export class DecimalFloatPipe implements PipeTransform {
  transform(value: any): any {
    return parseFloat(value);
  }
}
