import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFlightComponent } from './components/search-flight/search-flight.component';
import { SelectScheduleComponent } from './components/select-schedule/select-schedule.component';
import { PassengersComponent } from './components/passengers/passengers.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
  { path: '', component: SearchFlightComponent },
  { path: 'select', component: SelectScheduleComponent },
  { path: 'passengers', component: PassengersComponent },
  { path: 'extras', component: ExtrasComponent },
  { path: 'payment', component: PaymentComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
