import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';
import { Music } from 'src/app/musics/music.model';
import { MusicService } from 'src/app/musics/musics.service';
import { AddMusicToPlaylistComponent } from 'src/app/musics/playlists/add-music-to-playlist/add-music-to-playlist.component';
import { Playlist } from 'src/app/musics/playlists/playlist.model';
import { PlaylistsService } from 'src/app/musics/playlists/playlists.service';

@Component({
  selector: 'app-pop-over',
  templateUrl: './pop-over.page.html',
  styleUrls: ['./pop-over.page.scss'],
})
export class PopOverPage implements OnInit,OnDestroy {
  public musicSelected: Music;
  private mMusicSub: Subscription;
  private musicId: string;
  private mPlaylistSub:  Subscription;
  private playlistSelected: Playlist;

 constructor(
  private mPopOver: PopoverController,
  private mMusicService: MusicService,
  public params: NavParams,
  private mPlaylistservice: PlaylistsService,
  private mModalCtrl: ModalController
  ) {

  }

  ngOnInit() {
    this.musicId = this.params.get('id');
    this.mMusicSub = this.mMusicService.getMusic(this.musicId).subscribe(
      music => {
        this.musicSelected = music;
      });
  }


  closePopover(){
    this.mPopOver.dismiss();
  }

  musicAddFav(){
    this.musicTriggerFav(true);
  }
  musicRemoveFav(){
    this.musicTriggerFav(false);
  }


  musicTriggerFav(favValue: boolean){
    this.mMusicService.musicTriggerFav(this.musicSelected, favValue).subscribe();
    this.mPopOver.dismiss(favValue, 'favClosed');
  }

  musicAddPlaylist(){
    this.mModalCtrl.create({component: AddMusicToPlaylistComponent})
    .then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(result => {
      if(result.role === 'confirm'){
        this.mPlaylistSub = this.mPlaylistservice.getPlaylist(result.data.data.pId).subscribe(playlist => {
          this.playlistSelected = playlist;
        });
        this.mPlaylistSub = this.mPlaylistservice.addMusic(this.playlistSelected, this.musicSelected).subscribe(
          playlists => {this.mPopOver.dismiss();}
        );
      }
    });
  }

  musicDelete(){
    this.mMusicService.removeMusic(this.musicSelected).pipe(

      switchMap(() => this.mMusicService.fetchBeats()),
      switchMap(() => this.mMusicService.removeBeatStorage(this.musicSelected.title))
    ).subscribe(() => {
      this.mPopOver.dismiss('deleteMusic');
    });
  }


  ngOnDestroy(){
    if(this.mMusicSub){
      this.mMusicSub.unsubscribe();
    }
    if(this.mPlaylistSub){
      this.mPlaylistSub.unsubscribe();
    }
  }
}
