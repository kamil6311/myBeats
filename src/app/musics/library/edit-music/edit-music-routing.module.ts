import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMusicPage } from './edit-music.page';

const routes: Routes = [
  {
    path: '',
    component: EditMusicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMusicPageRoutingModule {}
