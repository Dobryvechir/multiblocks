import { Component } from '@angular/core';
import { SpnRollerCoaster } from './spn-roller-coaster.service';

@Component({
  selector: 'spn-view-content',
  templateUrl: './spn-view-content.component.html',
  styleUrls: ['./spn-view-content.component.less']
})
export class SpnViewContentComponent  {

  constructor(private rollerCoaster: SpnRollerCoaster) {
  }

  onOverlayClicked(evt: MouseEvent) {
    evt.stopPropagation();
    this.rollerCoaster.removePopup(); 
  }

  onDialogClicked(evt: MouseEvent) {
    evt.stopPropagation()
  }

}
