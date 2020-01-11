import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { SpnEditBlocks } from "../../models/spn-edit-block";
import { SpnEditControl } from "../../services/spn-edit-control.service";
import { ConfirmDialogComponent } from "chc-integral";

@Component({
  selector: "spn-selected-block",
  templateUrl: "./selected-block.component.html",
  styleUrls: ["./selected-block.component.less"]
})
export class SelectedBlockComponent implements OnInit {
  @Input() block: SpnEditBlocks;
  @ViewChild(ConfirmDialogComponent, {static: false}) confirmDialog: ConfirmDialogComponent;
  _blockTitleEdit: boolean = false;

  constructor(private spnEditControl: SpnEditControl) {
  }

  ngOnInit(): void {
    // window.console.log("blocks=", this.blocks);
  }

  _deleteBlock(): void {
    this._blockTitleEdit = false;
    this.confirmDialog.openModal();      
  }

  _deleteBlockInner(n: number): void {
    if (n===1) {
     this.spnEditControl.deleteCurrentBlock();
    }   
  }
  _createBlock(id: string): void {
    this._blockTitleEdit = true;
    this.spnEditControl.createBlock(id);
  }

}
