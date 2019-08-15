import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChcIntegralModule } from "chc-integral";
import { SpnEditHeaderComponent } from "./modules/bootstrap/spn-edit-header.component";
import { SpnEditFooterComponent } from "./modules/bootstrap/spn-edit-footer.component";
import { SpnEditControl } from "./services/spn-edit-control.service";
import { EditBlockComponent } from "./modules/editblock/edit-block.component";
import { SelectedBlockComponent } from "./modules/editblock/selected-block.component";

@NgModule({
  declarations: [
    SpnEditHeaderComponent,
    SpnEditFooterComponent,
    EditBlockComponent,
    SelectedBlockComponent
  ],
  imports: [
    BrowserModule,
    ChcIntegralModule,
    FormsModule 
  ],
  providers: [SpnEditControl],
  bootstrap: [SpnEditHeaderComponent, SpnEditFooterComponent]
})
export class SpnEditModule { }
