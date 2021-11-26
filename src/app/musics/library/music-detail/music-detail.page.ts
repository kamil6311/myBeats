import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Music } from '../../music.model';
import { MusicService } from '../../musics.service';

@Component({
  selector: 'app-music-detail',
  templateUrl: './music-detail.page.html',
  styleUrls: ['./music-detail.page.scss'],
})
export class MusicDetailPage implements OnInit,OnDestroy {
  music: Music;
  private musicId: string;
  private mMusicSub: Subscription;

  constructor(
    private mRoute: ActivatedRoute,
    private mMusicService: MusicService
  ) { }

  ngOnInit() {
    this.mRoute.paramMap.subscribe(params => {
      if(!params.has('musicId')){
        return;
      }
      else{
        this.musicId = params.get('musicId');
      }
    });
    this.mMusicSub = this.mMusicService.getMusic(this.musicId).subscribe(
      music => this.music = music
    );
  }

  ngOnDestroy(){
    this.mMusicSub = this.mMusicService.editMusicF(this.music).subscribe();
    if(this.mMusicSub){
      this.mMusicSub.unsubscribe();
    }
  }

}
