import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Music } from './music.model';
import { from, of, Subscription } from 'rxjs';
import { MusicService } from './musics.service';
import { MusicPlayerService } from '../player/music-player.service';
import { concatMap, map, take, tap } from 'rxjs/operators';


@Component({
  selector: 'app-musics',
  templateUrl: './musics.page.html',
  styleUrls: ['./musics.page.scss'],
})
export class MusicsPage implements OnInit {
  playClicked = false;
  isPlaying = false;
  music: Music;
  file: MediaObject;
  currentMusic: Music = null;

  private musicId: string;
  private mMusicSub: Subscription;

  constructor(
    private router: Router,
    private musicService: MusicService,
    private playerService: MusicPlayerService,
    public media: Media,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.playerService.currentMusic.subscribe({
      next: (music) => {
        this.currentMusic = music;
        this.playCurrent();
      }
    });
  }

  playCurrent(){
    this.musicService.getBeatStorage(this.currentMusic.title).pipe(
      map(file => {
        this.file = this.media.create(file);
        this.onPlayClick();
      }),
    ).subscribe();
  }

  onPlayClick(){
    this.playClicked = true;
    of(this.file.play()).subscribe(res => {
      this.playClicked = false;
    });
  }

  onPlayerClick(){
    if(this.playClicked){
      return;
    }
    else{
      this.router.navigateByUrl('musicPlayer');
    }
  }

}
