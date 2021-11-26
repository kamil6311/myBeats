import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryPage } from './library.page';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage
  },
  {
    path: 'new-music',
    loadChildren: () => import('./new-music/new-music.module').then( m => m.NewMusicPageModule)
  },
  {
    path: 'edit-music',
    loadChildren: () => import('./edit-music/edit-music.module').then( m => m.EditMusicPageModule)
  },
  {
    path: 'music-detail',
    loadChildren: () => import('./music-detail/music-detail.module').then( m => m.MusicDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {}
