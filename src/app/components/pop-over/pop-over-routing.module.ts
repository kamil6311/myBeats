import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PopOverPage } from './pop-over.page';

const routes: Routes = [
  {
    path: '',
    component: PopOverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),CommonModule],
  exports: [RouterModule],
})
export class PopOverPageRoutingModule {}
