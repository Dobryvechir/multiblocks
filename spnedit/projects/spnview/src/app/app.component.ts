import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'spv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class SpvAppComponent implements OnInit {
  title = 'spnview';
  @Input()
  pool: string;
  area: string;

   ngOnInit() {
       const el = window.document.querySelector('spv-root');
       this.pool = el && el.attributes["pool"] && el.attributes["pool"].value;
       this.area = el && el.attributes["area"] && el.attributes["area"].value;
       window.console.log(el);
   }
}
