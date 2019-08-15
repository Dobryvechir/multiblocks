import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SpvAppComponent } from './app.component';

@NgModule({
  declarations: [
    SpvAppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [SpvAppComponent]
})
export class AppModule { }
