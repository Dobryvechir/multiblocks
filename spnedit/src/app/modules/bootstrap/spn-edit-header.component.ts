import { Component } from "@angular/core";
import { SpnEditControl } from "../../services/spn-edit-control.service";

@Component({
  selector: "spn-edit-header",
  templateUrl: "./spn-edit-header.component.html",
  styleUrls: ["./spn-edit-header.component.less"]
})
export class SpnEditHeaderComponent {
  constructor(public spnEditControl: SpnEditControl ) {
  }
}
