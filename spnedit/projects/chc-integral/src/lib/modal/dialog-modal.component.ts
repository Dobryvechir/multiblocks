import { Component, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy } from "@angular/core";

import { DialogModalService } from "./dialog-modal.service";

@Component({
    selector: "ddv-dialog-modal",
    templateUrl: "dialog-modal.component.html",
    styleUrls: ["dialog-modal.component.less"]
})
export class DialogModalComponent implements OnInit {

    @Input()
    id: string;

    @Input()
    title: string;
    @Input()
    buttons: string[];
    @Input()
    height: number;
    @Input()
    width: number;
    @Output()
    buttonFire = new EventEmitter<number>();

    h: number;
    w: number;

    constructor(private dialogModalService: DialogModalService) {
          dialogModalService.init();
    }

    ngOnInit(): void {
        this.h = this.height || 190;
        this.w = this.width || 526;
    }

    openModal() {
        this.dialogModalService.open(this.id);
    }

    closeModal(n: number) {
        this.buttonFire.emit(n);
        this.dialogModalService.close(this.id);
    }
}