import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMusicPage } from './new-music.page';

const routes: Routes = [
  {
    path: '',
    component: NewMusicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewMusicPageRoutingModule {}
