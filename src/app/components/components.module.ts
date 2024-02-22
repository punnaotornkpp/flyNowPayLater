import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFlightComponent } from './search-flight/search-flight.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SearchFlightComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    CoreModule,
  ],
})
export class ComponentsModule {}
