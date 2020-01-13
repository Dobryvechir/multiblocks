import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpnViewTreeComponent } from './spn-view-tree.component';
import { SpnViewDataComponent } from './spn-view-data.component';

const routes: Routes = [
    {path: "content", component: SpnViewTreeComponent},
    {path: "**", component: SpnViewDataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
