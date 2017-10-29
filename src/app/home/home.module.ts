import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
// import { StartMenuInfoBarComponent } from '../components/win8/startMenuInfoBar/startMenuInfoBar.component';
// import { StartMenuInfoBarModule } from '../components/win8/startMenuInfoBar/startMenuInfoBar.module';

@NgModule({
  declarations: [
    // HomeComponent,
    // StartMenuInfoBarComponent
  ],
  imports: [
    BrowserModule,
    // StartMenuInfoBarModule
  ],
  providers: []
})
export class HomeModule { }
