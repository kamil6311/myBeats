import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { Music } from '../../music.model';
import { MusicService } from '../../musics.service';

import { Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Component({
  selector: 'app-music-detail',
  templateUrl: './music-detail.page.html',
  styleUrls: ['./music-detail.page.scss'],
})
export class MusicDetailPage implements OnInit,OnDestroy {
  music: Music;
  file: MediaObject;
  private musicId: string;
  private mMusicSub: Subscription;


  constructor(
    private mRoute: ActivatedRoute,
    private mMusicService: MusicService,
    public media: Media,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.mRoute.paramMap.pipe(
      concatMap(prms => {
        if(!prms.has('musicId')){
          return;
        }
        else{
          this.musicId = prms.get('musicId');
        }
        return this.mMusicService.getMusic(prms.get('musicId')).pipe(
          tap(music => {
              this.music = music;
            }
          )
        );
      }),
      concatMap(() =>
        this.mMusicService.getBeatStorage(this.music.title).pipe(
          map(file => {
              this.file = this.media.create(file);
          }),
        )
      )
    ).subscribe();

  }

  ngOnDestroy(){
    if(this.mMusicSub){
      this.mMusicSub.unsubscribe();
    }
    this.file.stop();
  }

  onPlay(){
    //this.file.play();
  }

  onPause(){
    this.file.pause();
  }
}
