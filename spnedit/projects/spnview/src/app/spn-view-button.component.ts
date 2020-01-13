import { Component } from '@angular/core';
import { SpnViewManagerService } from './spn-view-manager.service';

@Component({
  selector: 'spn-view-button',
  templateUrl: './spn-view-button.component.html',
  styleUrls: ['./spn-view-button.component.less']
})
export class SpnViewButtonComponent {
      constructor(public managerService: SpnViewManagerService){
      }
}
