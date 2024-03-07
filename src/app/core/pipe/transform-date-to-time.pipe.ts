import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateToTime',
})
export class TransformDateToTimePipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  }
}
