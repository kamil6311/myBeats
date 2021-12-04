/* eslint-disable @angular-eslint/no-output-rename */
import { AfterViewInit, Component, ElementRef, OnInit, Output, Renderer2, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Media,MediaObject } from '@ionic-native/media/ngx';
import { Gesture, GestureConfig, GestureController, ModalController, Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { Music } from 'src/app/musics/music.model';
import { MusicService } from 'src/app/musics/musics.service';
import { MusicPlayerService } from '../music-player.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.page.html',
  styleUrls: ['./music-player.page.scss'],
})
export class MusicPlayerPage implements OnInit, AfterViewInit {
  @ViewChild('drawer', {read: ElementRef}) drawer: ElementRef;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();

  gesture: Gesture;
  isPlayerOpen = false;
  openHeight = 0;

  currentMusic: Music;
  file: MediaObject;
  currentPosition: number;
  playClicked = false;
  audioDuration: number;
  restTime: string;
  isPlaying = false;
  position: number;


  constructor(
    private gestureCtrl: GestureController,
    private element: ElementRef,
    private renderer: Renderer2,
    private modalCtrl: ModalController,
    private platform: Platform,
    private changeDetectorRef: ChangeDetectorRef,
    private playerService: MusicPlayerService,
    private musicService: MusicService,
    public media: Media
  ) { }


  ngAfterViewInit(){
    const drawer = this.drawer.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 70;

    const gesture = this.gestureCtrl.create({
      el: drawer,
      gestureName: 'musicPlayerSwipe',
      direction: 'y',
      onMove: ev => {
        if(ev.deltaY < -this.openHeight){return;}
        drawer.style.transition = '.3s ease-out;';
        drawer.style.transform = `translateY(${ev.deltaY}px)`;
        if(ev.deltaY > 120){
          this.togglePlayer();
        }
      },
      onEnd: ev => {
        if(ev.deltaY < -50 && !this.isPlayerOpen){

        }else if(ev.deltaY < 120){
          drawer.style.transition = '.3s ease-out';
          drawer.style.transform = `translateY(0px)`;
        }
      },
    });

    this.changeDetectorRef.detectChanges();
    gesture.enable(true);
  }

  ngOnInit() {
    this.position = this.currentPosition;

    this.playerService.playingMusic.subscribe({
      next: (music: Music) => {
        if(music.title){
          this.currentMusic = music;
          this.musicService.getBeatStorage(this.currentMusic.title).subscribe(
            fl => {
              this.file = this.media.create(fl);
            }
          );
        }
      }
    });

    this.playerService.playStatus.subscribe({
      next: (value: boolean) => {
        if(value){
          this.isPlaying = true;
        }
        else{
          this.isPlaying = false;
        }
      }
    });

    setInterval(() => {
      this.position += this.file.getDuration() / 100;
    }, 200);
  }

  togglePlayer(){
    this.modalCtrl.dismiss();
  }

  onPlayClick(){
    this.playerService.playToggle(true);
  }

  onPauseClick(){
    this.playerService.playToggle(false);
  }

  onNext(){
    if(this.currentMusic.title){
      this.playerService.playToggle(false);
    }
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
