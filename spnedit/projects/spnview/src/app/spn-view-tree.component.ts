import { Component, OnInit } from '@angular/core';
import { SpnEditBlocks } from './models/spn-edit-block';
import { SpnViewManagerService } from './spn-view-manager.service';

@Component({
  selector: 'spn-view-tree',
  templateUrl: './spn-view-tree.component.html',
  styleUrls: ['./spn-view-tree.component.less']
})
export class SpnViewTreeComponent implements OnInit {
       main: SpnEditBlocks;
       constructor(private managerService: SpnViewManagerService) {
       }

       ngOnInit(): void {
          this.main = this.managerService.allBlocks[0];
       }
}                                                                                                
