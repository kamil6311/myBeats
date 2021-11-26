import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MusicsPage } from './musics.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MusicsPage,
    children: [
      {path: 'library', children: [
          {
            path: '',
            loadChildren: () => import('./library/library.module').then(m => m.LibraryPageModule)
          },
          {
            path: 'newMusic',
            loadChildren: () => import('./library/new-music/new-music.module').then(m => m.NewMusicPageModule)
          },
          {
            path:'edit/:musicId',
            loadChildren: () => import('./library/edit-music/edit-music.module').then(m => m.EditMusicPageModule)
          },
          {
            path: ':musicId',
            loadChildren: () => import('./library/music-detail/music-detail.module').then(m => m.MusicDetailPageModule)
          }
        ]},
      {path: 'playlists', children: [
          {
            path: '',
            loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsPageModule)
          },
          {
            path: 'newPlaylist',
            loadChildren: () => import('./playlists/new-playlist/new-playlist.module').then(m => m.NewPlaylistPageModule)
          },
          {
            path: 'edit/:playlistId',
            loadChildren: () => import('./playlists/edit-playlist/edit-playlist.module').then(m => m.EditPlaylistPageModule)
          },
          {
            path:':playlistId',
            loadChildren: () => import('./playlists/playlist-detail/playlist-detail.module').then(m => m.PlaylistDetailPageModule)
          }
      ]},
      {path: 'account', children: [
        {
          path: '',
          loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
        }
      ]},
      {
        path: '',
        redirectTo: '/musics/tabs/library',
        pathMatch: 'full'
      }
    ]
  },
  {
    path:'',
    redirectTo: '/musics/tabs/library',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicsPageRoutingModule {}
