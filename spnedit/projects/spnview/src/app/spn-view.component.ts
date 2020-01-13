import { Component } from '@angular/core';
import { SpnViewManagerService } from './spn-view-manager.service';

@Component({
  selector: 'spn-view',
  templateUrl: './spn-view.component.html',
  styleUrls: ['./spn-view.component.less']
})
export class SpnViewComponent {
     constructor(private managerService: SpnViewManagerService) {
           managerService.fullInit();
     }
}
