import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFlightComponent } from './components/search-flight/search-flight.component';

const routes: Routes = [
  { path: '', component: SearchFlightComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
