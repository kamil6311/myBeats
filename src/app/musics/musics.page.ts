import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { Gesture, GestureConfig, GestureController, ModalController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Music } from './music.model';
import { from, interval, of, Subscription } from 'rxjs';
import { MusicService } from './musics.service';
import { MusicPlayerService } from '../player/music-player.service';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { MusicPlayerPage } from '../player/music-player/music-player.page';


@Component({
  selector: 'app-musics',
  templateUrl: './musics.page.html',
  styleUrls: ['./musics.page.scss'],
})
export class MusicsPage implements OnInit {
  playClicked = false;
  isPlaying = false;
  music: Music;
  file: MediaObject = this.media.create('');
  currentMusic: Music = null;
  gesture: Gesture;
  audioDuration: number;
  currentPosition: number;
  restTime: string;

  backdropVisible = false;

  private nextClicked = false;
  private musicId: string;
  private mMusicSub: Subscription;
  private progressSub: Subscription;

  constructor(
    private router: Router,
    private musicService: MusicService,
    private playerService: MusicPlayerService,
    private modalCtrl: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    public media: Media,
    public platform: Platform,
  ) {}

  toggleBackdrop(isVisible: boolean){
    this.backdropVisible = isVisible;
    this.changeDetectorRef.detectChanges();
  }


  ngOnInit() {
    this.playerService.playingMusic.subscribe({
      next: (music: Music) => {
        this.currentMusic = music;
        if(music.title){
          this.playCurrent();
        }
      }
    });
    this.playerService.playStatus.subscribe({
      next: (status: boolean) => {
        if(this.file){
          if(status){

            this.file.play();
          }
          else{
            this.file.pause();
          }
        }
        this.isPlaying = status;
      }
    });
  }

  playCurrent(){
    if(this.file){
      this.file.stop();
    }
    this.musicService.getBeatStorage(this.currentMusic.title).subscribe(
    fl => {
      this.file = this.media.create(fl);
      this.isPlaying = true;
      this.file.play();
      this.playerService.playToggle(true);

      this.nextClicked = false;

      setInterval(() => {
        this.file.getCurrentPosition().then((position) => {
          this.audioDuration = Math.floor(this.file.getDuration());
          this.currentPosition = (position/this.audioDuration);
        });
      }, 400);
    });
  }

  onPlayClick(){
    this.playClicked = true;
    if(this.currentMusic.title){
      this.isPlaying = true;
      this.file.setVolume(0);
      this.file.play();
      this.playerService.playToggle(true);

      from(interval(100)).pipe(
        take(5),
        tap(nb => {
          this.file.setVolume(0+(nb/10));
        })
      ).subscribe({
        complete: () => {
          this.file.setVolume(1);
          this.playClicked = false;
        }
      });
    }
    else{
      this.musicService.musics.subscribe(
        musics => {
          this.playerService.setPlayingMusic(musics[0]);
        }
      );
    }

  }

  async onPlayerClick(){
    if(this.playClicked || this.nextClicked){
      return;
    }
    else{
      this.modalCtrl.create({
        component: MusicPlayerPage,
        componentProps: {
          currentMusic: this.currentMusic,
          file: this.file,
          currentPosition: this.currentPosition
        }
      })
      .then(modal => {
        modal.present();
        return modal.onDidDismiss();
      });
    }
  }

  onPauseClick(){
    this.playClicked = true;
    this.isPlaying = false;
    from(interval(100)).pipe(
      take(5),
      tap(nb => {
        this.file.setVolume(1-(nb/10));
      })
    ).subscribe({
      complete: () => {
        this.file.pause();
        this.playerService.playToggle(false);
        this.file.setVolume(1);
        this.playClicked = false;
      }
    });
  }

  onNextClick(){
    if(this.currentMusic.title){
      this.file.stop();
    }
    this.nextClicked = true;
    let nextMusic;

    this.musicService.musics.subscribe(
      musics => {
        const index = musics.findIndex(music => music.id === this.currentMusic.id);
        nextMusic = musics[index +1];
        if(nextMusic !== undefined){
          this.playerService.setPlayingMusic(nextMusic);
        }
        else{
          this.playerService.setPlayingMusic(musics[0]);
        }
      }
    );
  }

}
