import {Injectable} from "@angular/core";


@Injectable()
export class DialogModalService {
    static cssStuff: string = "ddv-modal {display: none;} body.ddv-modal-open {overflow: hidden;}"; 
    private modals: any[] = [];
    private inited: boolean = false;

    addCss(css: string) {
       if (css) {
           const styleSheet = window.document.createElement("style");
           styleSheet.type = "text/css";
           styleSheet.innerText = css;
           window.document.head.appendChild(styleSheet);
       }
    }

    init() {
        if (!this.inited) {
             this.addCss(DialogModalService.cssStuff); 
             this.inited = true;   
        }
    }

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string) {
        // open modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }
}