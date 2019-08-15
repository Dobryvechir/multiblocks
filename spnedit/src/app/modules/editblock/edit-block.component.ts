import { Component, Input, OnInit } from "@angular/core";
import { SpnEditBlocks } from "../../models/spn-edit-block";
import { SpnEditControl } from "../../services/spn-edit-control.service";

@Component({
  selector: "spn-edit-block",
  templateUrl: "./edit-block.component.html",
  styleUrls: ["./edit-block.component.less"]
})
export class EditBlockComponent implements OnInit {
  @Input() blocks: SpnEditBlocks[];

  constructor(private spnEditControl: SpnEditControl) {
  }

  ngOnInit(): void {
    // window.console.log("blocks=", this.blocks);
  }

  _selectBlock(id: string): void {
    this.spnEditControl.chooseCurrentBlock(id);
  }
}
