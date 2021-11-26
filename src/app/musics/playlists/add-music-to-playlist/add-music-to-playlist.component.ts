import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { from, Observable, Subscription } from 'rxjs';
import { concatMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { NewPlaylistPage } from '../new-playlist/new-playlist.page';
import { Playlist } from '../playlist.model';
import { PlaylistsService } from '../playlists.service';

@Component({
  selector: 'app-add-music-to-playlist',
  templateUrl: './add-music-to-playlist.component.html',
  styleUrls: ['./add-music-to-playlist.component.scss'],
})
export class AddMusicToPlaylistComponent implements OnInit,OnDestroy {
  playlists: Playlist[];
  private mPlaylistsSub: Subscription;

  constructor(
    private mModalCtrl: ModalController,
    private mPlaylistService: PlaylistsService,
    private mAuthService: AuthService,
    private mNavCtrl: NavController,
    private mRoute: RouterModule
    ) { }
  ngOnDestroy(): void {
    if(this.mPlaylistsSub){
      this.mPlaylistsSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.mPlaylistsSub = this.mPlaylistService.playlists.subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  onCancel(){
    this.mModalCtrl.dismiss(null, 'cancel');
  }

  onAddPlaylistClick(){
    this.mModalCtrl.create({component:NewPlaylistPage})
    .then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(res => {
      if(res.role === 'confirm'){
        const data = res.data.playlistData;
        this.mAuthService.userId.pipe(
          take(1),
          concatMap(userId => {
              if(!userId){
                return;
              }else{
                return this.mPlaylistService.addPlaylist(data.title, userId, data.img).pipe(tap(
                  playlists => {
                    this.playlists = playlists;
                  }
                ));
              }
          })
          ).subscribe();
        // this.mPlaylistsSub = this.mPlaylistService.addPlaylist(data.title, this.mAuthService.userId, data.img).subscribe(
        //   playlists => {
        //     this.playlists = playlists;
        //   }
        // );
      }
    });

  }

  playlistClick(playlistId: string){
    this.mModalCtrl.dismiss({
      data:{
        pId: playlistId
      }
    },'confirm');

  }

}
