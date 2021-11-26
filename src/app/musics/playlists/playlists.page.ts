import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { NewPlaylistPage } from './new-playlist/new-playlist.page';
import { Playlist } from './playlist.model';
import { PlaylistsService } from './playlists.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.page.html',
  styleUrls: ['./playlists.page.scss'],
})
export class PlaylistsPage implements OnInit , OnDestroy{
  playlists: Playlist[];
  playlistsObs: Observable<Playlist[]>;
  private mPlaylistSub: Subscription;
  private userId: string;

  constructor(
    private mPlaylistsService: PlaylistsService,
    private mModalCtrl: ModalController,
    private mAuthService: AuthService
    ) {}


  ngOnInit() {
    this.mPlaylistSub = this.mPlaylistsService.playlists.subscribe(playlists =>{
      this.playlists = playlists;
    });
    this.playlistsObs = this.mPlaylistsService.playlists;
    this.mAuthService.userId.pipe(take(1)).subscribe(userId=> this.userId = userId);
  }

  ngOnDestroy() {
    if(this.mPlaylistSub){
      this.mPlaylistSub.unsubscribe();
    }
  }

  onAddPlaylistClick(){
    this.mModalCtrl.create({component:NewPlaylistPage})
    .then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(res => {
      if(res.role === 'confirm'){
        const data = res.data.playlistData;
        this.mPlaylistSub = this.mPlaylistsService.addPlaylist(data.title, this.userId, data.img).subscribe();
        console.log(this.playlists);
      }
    });

  }

}
