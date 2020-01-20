import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { SpnViewComponent } from './spn-view.component';
import { SpnViewContentComponent } from './spn-view-content.component';
import { SpnViewButtonComponent } from './spn-view-button.component';
import { SpnViewDataComponent } from './spn-view-data.component';
import { SpnViewItemComponent } from './spn-view-item.component';
import { SpnViewManagerService } from './spn-view-manager.service';
import { SpnViewTreeComponent } from './spn-view-tree.component';
import { SpnRollerCoaster } from './spn-roller-coaster.service';

@NgModule({
  declarations: [
    SpnViewComponent,
    SpnViewContentComponent,
    SpnViewButtonComponent,
    SpnViewDataComponent,
    SpnViewItemComponent,
    SpnViewTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SpnViewManagerService, SpnRollerCoaster],
  entryComponents: [SpnViewContentComponent],
  bootstrap: [SpnViewComponent]
})
export class AppModule { }
