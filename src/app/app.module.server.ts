import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [AppModule, ServerModule, TranslateModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
