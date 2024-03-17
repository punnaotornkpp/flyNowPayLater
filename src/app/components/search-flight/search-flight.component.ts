import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-flight',
  templateUrl: './search-flight.component.html',
  styleUrl: './search-flight.component.scss',
})
export class SearchFlightComponent {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }
  colorControl = new FormControl();
}
