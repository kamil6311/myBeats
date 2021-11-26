import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Music } from '../../music.model';
import { Playlist } from '../playlist.model';
import { PlaylistsService } from '../playlists.service';
import { PopOverPage } from 'src/app/components/pop-over/pop-over.page';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.page.html',
  styleUrls: ['./playlist-detail.page.scss'],
})
export class PlaylistDetailPage implements OnInit, OnDestroy {
  playlist: Playlist;
  musics: Music[];
  musicsObs: Observable<Music[]>;
  private mPlaylistSub: Subscription;
  private mMusicSub: Subscription;

  constructor(
    private mPopOverCtrl: PopoverController,
    private mRoute: ActivatedRoute,
    private mPlaylistService: PlaylistsService,
    private mNavCtrl: NavController
    ) { }


  ngOnInit() {
    this.mRoute.paramMap.subscribe(params => {
      if(!params.get('playlistId')){
        this.goBack();
        return;
      }
      else{
        // this.mPlaylistSub = this.mPlaylistService.getPlaylist(params.get('playlistId')).subscribe(playlist => {
        //   this.playlist = playlist;
        //   this.mMusicSub = this.playlist.musics.subscribe(musics => {
        //     this.musics = musics;}
        //     );
        // });

        //#2
        this.mPlaylistSub = this.mPlaylistService.getPlaylist(params.get('playlistId')).subscribe(playlist => {
          this.playlist = playlist;
          this.musics = this.playlist.musics;
        });

      }
    });

    //this.musicsObs = this.playlist.musics;
  }

  ngOnDestroy(){
    if(this.mPlaylistSub){
      this.mPlaylistSub.unsubscribe();
    }
    if(this.mMusicSub){
      this.mMusicSub.unsubscribe();
    }
  }

  goBack(){
    this.mNavCtrl.navigateBack('/musics/tabs/playlists');
  }

  async onOptionMusicClick(musicId: string, ev: Event, music: Music){
    const popOver = this.mPopOverCtrl.create({
      component: PopOverPage,
      showBackdrop: true,
      translucent: true,
      event: ev,
      animated: true,
      componentProps: {id: musicId}
    });
    (await popOver).present();
  }


}
