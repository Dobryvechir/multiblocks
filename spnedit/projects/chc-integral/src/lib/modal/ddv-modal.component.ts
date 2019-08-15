import { Component, ElementRef, Input, OnInit, OnDestroy } from "@angular/core";

import { DialogModalService } from "./dialog-modal.service";

@Component({
    selector: "ddv-modal",
    templateUrl: "ddv-modal.component.html",
    styleUrls: ["ddv-modal.component.less"]
})
export class DdvModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element: any;
    @Input() height: number;
    @Input() width: number;

    constructor(private dialogModalService: DialogModalService, private el: ElementRef) {
        dialogModalService.init();
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        let modal = this;

        // ensure id attribute exists
        if (!this.id) {
            console.error("modal must have an id");
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener("click", function (e: any) {
            if (e.target.className === "ddv-modal") {
                modal.close();
            }
        });

        // add self (this modal instance) to the modal service so it"s accessible from controllers
        this.dialogModalService.add(this);
    }                   

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.dialogModalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = "block";
        document.body.classList.add("ddv-modal-open");
    }

    // close modal
    close(): void {
        this.element.style.display = "none";
        document.body.classList.remove("ddv-modal-open");
    }
}