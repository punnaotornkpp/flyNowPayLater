import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from './material.module';
import { StepComponent } from './step/step.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    StepComponent,
  ],
  imports: [CommonModule, MaterialModule],
  exports: [HeaderComponent, FooterComponent, SearchComponent, StepComponent],
})
export class SharedModule {}
