import { Type } from '@angular/core';
import { ExtraBaggageComponent } from '../shared/extra-baggage/extra-baggage.component';
import { ExtraSelectionSeatComponent } from '../shared/extra-selection-seat/extra-selection-seat.component';
import { ExtraSpecialBaggageComponent } from '../shared/extra-special-baggage/extra-special-baggage.component';

export interface IExtras {
  id: number;
  title: string;
  content: string;
  status: boolean;
  button: string;
  detail: IExtrasDetail;
  img: string;
}

interface IExtrasDetail {
  title: string;
  link: string;
}

type DialogComponentType =
  | ExtraSelectionSeatComponent
  | ExtraBaggageComponent
  | ExtraSpecialBaggageComponent;

export interface DialogConfig {
  [key: number]: {
    component: Type<DialogComponentType>;
    width: string;
    height: string;
    data: string;
  };
}
