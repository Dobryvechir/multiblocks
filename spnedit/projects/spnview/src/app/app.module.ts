import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { SpnViewComponent } from './spn-view.component';
import { SpnViewContentComponent } from './spn-view-content.component';
import { SpnViewButtonComponent } from './spn-view-button.component';
import { SpnViewDataComponent } from './spn-view-data.component';
import { SpnViewManagerService } from './spn-view-manager.service';
import { SpnViewTreeComponent } from './spn-view-tree.component';

@NgModule({
  declarations: [
    SpnViewComponent,
    SpnViewContentComponent,
    SpnViewButtonComponent,
    SpnViewDataComponent,
    SpnViewTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SpnViewManagerService],
  entryComponents: [SpnViewContentComponent],
  bootstrap: [SpnViewComponent]
})
export class AppModule { }
