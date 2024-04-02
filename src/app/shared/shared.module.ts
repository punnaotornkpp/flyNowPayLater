import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from './material.module';
import { StepComponent } from './step/step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule/schedule.component';
import { FlightComponent } from './flight/flight.component';
import { DialogDetailFlightComponent } from './dialog-detail-flight/dialog-detail-flight.component';
import { DetailFlightComponent } from './detail-flight/detail-flight.component';
import { PopupComponent } from './popup/popup.component';
import { CoreModule } from '../core/core.module';
import { ExtraBaggageComponent } from './extra-baggage/extra-baggage.component';
import { ExtraSelectionSeatComponent } from './extra-selection-seat/extra-selection-seat.component';
import { ComplateComponent } from './status/complate/complate.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    StepComponent,
    ScheduleComponent,
    FlightComponent,
    DialogDetailFlightComponent,
    DetailFlightComponent,
    PopupComponent,
    ExtraBaggageComponent,
    ExtraSelectionSeatComponent,
    ComplateComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    StepComponent,
    ScheduleComponent,
    PopupComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    TranslateModule,
  ],
})
export class SharedModule {}
