import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from './material.module';
import { StepComponent } from './step/step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule/schedule.component';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    StepComponent,
    ScheduleComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    StepComponent,
    ScheduleComponent,
  ],
})
export class SharedModule {}
