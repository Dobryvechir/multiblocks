import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChcIntegralComponent } from "./chc-integral.component";
import { ConfirmDialogComponent } from "./confirm/confirm-dialog.component";
import { DialogModalComponent } from "./modal/dialog-modal.component";
import { DdvModalComponent } from "./modal/ddv-modal.component";
import { DialogModalService} from "./modal/dialog-modal.service";

@NgModule({
  declarations: [
      ChcIntegralComponent,
      ConfirmDialogComponent,
      DialogModalComponent,
      DdvModalComponent
  ],
  exports: [
      ChcIntegralComponent,
      ConfirmDialogComponent,
      DialogModalComponent,
      DdvModalComponent
  ],
  imports: [
      BrowserModule,
      FormsModule
  ],
  providers: [DialogModalService]
})
export class ChcIntegralModule { }
