import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[NumberInputDirective]',
  exportAs: 'NumberInputDirective',
})
export class NumberInputDirective {
  constructor(private eleRef: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.eleRef.nativeElement.value;

    this.eleRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this.eleRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
