import { Component, OnInit } from '@angular/core';
import { SpnViewManagerService } from './spn-view-manager.service';

@Component({
  selector: 'spn-view-data',
  templateUrl: './spn-view-data.component.html',
  styleUrls: ['./spn-view-data.component.less']
})
export class SpnViewDataComponent {
    constructor (public managerService: SpnViewManagerService) {
    }
}
