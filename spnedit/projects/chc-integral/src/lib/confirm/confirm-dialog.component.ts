import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";

import { DialogModalService } from "../modal/dialog-modal.service";
import { DialogModalComponent } from "../modal/dialog-modal.component";

@Component({
    selector: "ddv-confirm-dialog",
    templateUrl: "confirm-dialog.component.html",
    styleUrls: ["confirm-dialog.component.less"]
})
export class ConfirmDialogComponent {
    @Input()
    message: string;
    @Input()
    title: string;
    @Input()
    buttons: string[];
    @Output()
    buttonConfirm = new EventEmitter<number>();

    @ViewChild(DialogModalComponent) dialogModal: DialogModalComponent;

    openModal() {
        this.dialogModal.openModal();
    }
}
