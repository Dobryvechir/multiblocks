import { Component } from "@angular/core";
import { SpnEditControl } from "../../services/spn-edit-control.service";

@Component({
  selector: "spn-edit-footer",
  templateUrl: "./spn-edit-footer.component.html",
  styleUrls: ["./spn-edit-footer.component.less"]
})
export class SpnEditFooterComponent {
  constructor(public spnEditControl: SpnEditControl ) {
  }
}
