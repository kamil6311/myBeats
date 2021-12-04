/* eslint-disable @angular-eslint/no-output-rename */
import { AfterViewInit, Component, ElementRef, OnInit, Output, Renderer2, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Media,MediaObject } from '@ionic-native/media/ngx';
import { Gesture, GestureConfig, GestureController, ModalController, Platform } from '@ionic/angular';
import { Music } from 'src/app/musics/music.model';
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


  constructor(
    private gestureCtrl: GestureController,
    private element: ElementRef,
    private renderer: Renderer2,
    private modalCtrl: ModalController,
    private platform: Platform,
    private changeDetectorRef: ChangeDetectorRef,
    private playerService: MusicPlayerService,
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
        drawer.style.transform = `translateY(${ev.deltaY}px)`;
        this.modalCtrl.dismiss();
      },
      onEnd: ev => {
        if(ev.deltaY < -50 && !this.isPlayerOpen){
        }else if(ev.deltaY > 50 && this.isPlayerOpen){

        }
        this.changeDetectorRef.detectChanges();
      },
    });

    gesture.enable(true);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    console.log(this.file);
    console.log(this.currentPosition);

    this.playerService.playStatus.subscribe({
      next: (value: boolean) => {
        console.log(value);
        if(value){
          this.isPlaying = true;
        }
        else{
          this.isPlaying = false;
        }
      }
    });

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
}
