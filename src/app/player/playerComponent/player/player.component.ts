/* eslint-disable @angular-eslint/no-output-rename */
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit,Output,Renderer2, ViewChild } from '@angular/core';
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
import { EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('drawer', {read: ElementRef}) drawer: ElementRef;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();



  playClicked = false;
  isPlaying = false;
  file: MediaObject;
  currentMusic: Music = null;
  gesture: Gesture;
  isPlayerOpen = false;
  openHeight = 0;


  private musicId: string;
  private musicSub: Subscription;

  constructor(
    private router: Router,
    private musicService: MusicService,
    private playerService: MusicPlayerService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    public media: Media,
    public platform: Platform,
    private gestureCtrl: GestureController,
    private element: ElementRef,
    private renderer: Renderer2
  ) {
  }


  async ngAfterViewInit(){
    const drawer = this.drawer.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 70;

    const gesture = this.gestureCtrl.create({
      el: drawer,
      gestureName: 'musicPlayerSwipe',
      direction: 'y',
      onMove: ev => {
        if(ev.deltaY < -this.openHeight){return;}
        drawer.style.transform = `translateY(${ev.deltaY}px)`;
      },
      onEnd: ev => {
        if(ev.deltaY < -50 && !this.isPlayerOpen){
          drawer.style.transition = '.3s ease-out';
          drawer.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isPlayerOpen = true;
        }else if(ev.deltaY > 50 && this.isPlayerOpen){
          drawer.style.transition = '.3s ease-out';
          drawer.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(false);
          this.isPlayerOpen = false;
        }
        this.changeDetectorRef.detectChanges();
      },
    });

    gesture.enable(true);
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
    if(this.currentMusic.title){
      this.isPlaying = true;
      this.file.play();
    }
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
    this.togglePlayer();
  }


  ngOnDestroy() {
    if(this.musicSub){
      this.musicSub.unsubscribe();
    }
  }

  togglePlayer(){
    const drawer = this.drawer.nativeElement;
    this.openState.emit(!this.openState);

    if(this.isPlayerOpen){
      drawer.style.transition = '.3s ease-out';
      drawer.style.transform = '';
      this.isPlayerOpen = false;
      this.changeDetectorRef.detectChanges();
    }else{
      drawer.style.transition = '.3s ease-in';
      drawer.style.transform = `translateY(${-this.openHeight}px)`;
      this.isPlayerOpen = true;
      this.changeDetectorRef.detectChanges();
    }
  }
}
