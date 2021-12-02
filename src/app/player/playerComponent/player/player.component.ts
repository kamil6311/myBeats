import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit,Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Platform } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Music } from 'src/app/musics/music.model';
import { MusicService } from 'src/app/musics/musics.service';
import { MusicPlayerService } from '../../music-player.service';
import { GestureController } from '@ionic/angular';
import {GestureConfig,Gesture} from '@ionic/core';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('image', {static: false})
  imageElement: ElementRef;


  playClicked = false;
  isPlaying = false;
  file: MediaObject;
  currentMusic: Music = null;
  gesture: Gesture;
  isPlayerBig = false;


  private musicId: string;
  private musicSub: Subscription;

  constructor(
    private router: Router,
    private musicService: MusicService,
    private playerService: MusicPlayerService,
    public media: Media,
    public platform: Platform,
    private gestureCtrl: GestureController,
    private element: ElementRef,
    private renderer: Renderer2
  ) {
  }


  async ngAfterViewInit(){
    const options: GestureConfig = {
      el: this.element.nativeElement,
      direction: 'y',
      gestureName: 'musicPlayerSwipe',
      onStart: () => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', 'none');
      },
      onMove: ev => {
        if(ev.deltaY < 0){
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(${ev.deltaY}px)`);
          //this.renderer.setStyle(this.imageElement.nativeElement, 'transform', 'size: 50px');
        }
        if(ev.deltaY < -50){
          this.isPlayerBig = true;
        }
        if(ev.deltaY > -50){
          this.isPlayerBig = false;
        }

        console.log(this.isPlayerBig);
      },
      onEnd: ev => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', '0.4s ease-out');

        if(ev.deltaY < -100){
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-500px)`);
        }
        else{
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(0px)`);
        }
        console.log(this.isPlayerBig);

      },
    };

    this.gesture = await this.gestureCtrl.create(options);
    this.gesture.enable();
  }

  ngOnInit() {
    this.playerService.playingMusic.subscribe({
      next: (music: Music) => {
        this.currentMusic = music;
        this.playCurrent();
      }
    });

    //this.currentMusic = new Music('', '', '', 0, 'assets/icon/music2.png', false, '');

  }

  playCurrent(){
    if(this.file){
      this.file.pause();
      console.log('pause');
    }
    this.musicSub = this.musicService.getBeatStorage(this.currentMusic.title).subscribe(
    fl => {
      this.file = this.media.create(fl);
      this.isPlaying = true;
      this.file.play();
    });
  }

  onPlayClick(){
    this.isPlaying = true;

    this.file.play();
  }
  onPauseClick(){
    this.isPlaying = false;
    this.file.pause();
  }

  onPlayerClick(){
    if(this.playClicked){
      return;
    }
    else{
      this.router.navigateByUrl('musicPlayer');
    }
  }

  onBtnUpClick(){
    this.isPlayerBig = true;
  }


  ngOnDestroy() {
    if(this.musicSub){
      this.musicSub.unsubscribe();
    }
  }
}


/*
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit,Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Music } from 'src/app/musics/music.model';
import { MusicService } from 'src/app/musics/musics.service';
import { MusicPlayerService } from '../../music-player.service';
import { GestureController } from '@ionic/angular';
import {GestureConfig,Gesture} from '@ionic/core';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit,OnDestroy {
  currentMusic: Music = null;
  isPlayerBig = false;
  isPlaying = false;

  constructor(private playerService: MusicPlayerService
  ) {
  }


  async ngAfterViewInit(){
  }

  ngOnInit() {
    this.playerService.playingMusic.subscribe({
      next: (music: Music) => {
        this.currentMusic = music;
      }
    });

  }

  playCurrent(){

  }

  onPlayClick(){

  }
  onPauseClick(){

  }

  onPlayerClick(){

  }

  onBtnUpClick(){

  }


  ngOnDestroy() {

  }
}*/
