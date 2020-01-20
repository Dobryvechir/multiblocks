import { Injectable } from '@angular/core';

@Injectable()
export class SpnRollerCoaster {
    popupElement: HTMLElement;
    currentPage = '0';
    modalSpn = 'spn-modal-open';
    
    public updatePopupVisibility():void {
        const isMain = this.currentPage === '0';
        this.popupElement.style.display =  isMain ? 'none' : 'block';
        let cls = document.body.className + '';
        let pos = cls.indexOf(this.modalSpn);
        if (isMain) {
           if (pos>=0) {
              let rest = cls.substring(pos + this.modalSpn.length).trim();
              cls = cls.substring(0,pos).trim();
              if (rest) {
                  cls+=' '+rest;
              } 
           }
        } else {
           if (pos<0) {
                  cls= (cls + ' '+ this.modalSpn).trim();
           }
        }
        document.body.className = cls;
    }

    public removePopup(): void {
        window.location.hash = '#/0';
        this.currentPage = '0';
        this.updatePopupVisibility();
    }
    
}
