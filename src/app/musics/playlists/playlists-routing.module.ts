import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaylistsPage } from './playlists.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistsPage
  },
  {
    path: 'edit-playlist',
    loadChildren: () => import('./edit-playlist/edit-playlist.module').then( m => m.EditPlaylistPageModule)
  },
  {
    path: 'new-playlist',
    loadChildren: () => import('./new-playlist/new-playlist.module').then( m => m.NewPlaylistPageModule)
  },
  {
    path: 'playlist-detail',
    loadChildren: () => import('./playlist-detail/playlist-detail.module').then( m => m.PlaylistDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistsPageRoutingModule {}
