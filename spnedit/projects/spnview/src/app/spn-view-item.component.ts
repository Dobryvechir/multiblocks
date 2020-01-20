import { Component, Input } from '@angular/core';
import { SpnEditBlocks } from './models/spn-edit-block';

@Component({
  selector: 'spn-view-item',
  templateUrl: './spn-view-item.component.html',
  styleUrls: ['./spn-view-item.component.less']
})
export class SpnViewItemComponent {
     @Input()
     item: SpnEditBlocks;
}
