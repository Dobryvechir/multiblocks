import { Component } from '@angular/core';

@Component({
  selector: 'spn-view-content',
  templateUrl: './spn-view-content.component.html',
  styleUrls: ['./spn-view-content.component.less']
})
export class SpnViewContentComponent  {

  onOverlayClicked(evt: MouseEvent) {
    // close the dialog
  }

  onDialogClicked(evt: MouseEvent) {
    evt.stopPropagation()
  }

}
