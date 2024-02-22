import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFlightComponent } from './components/search-flight/search-flight.component';
import { SelectScheduleComponent } from './components/select-schedule/select-schedule.component';

const routes: Routes = [
  { path: '', component: SearchFlightComponent },
  { path: 'select', component: SelectScheduleComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
