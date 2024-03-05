import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFlightComponent } from './search-flight/search-flight.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { SelectScheduleComponent } from './select-schedule/select-schedule.component';
import { PassengersComponent } from './passengers/passengers.component';
import { ExtrasComponent } from './extras/extras.component';
import { PaymentComponent } from './payment/payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    SearchFlightComponent,
    SelectScheduleComponent,
    PassengersComponent,
    ExtrasComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    CoreModule,
    ReactiveFormsModule,
  ],
})
export class ComponentsModule {}
