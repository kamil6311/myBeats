/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Music } from '../../music.model';
import { MusicService } from '../../musics.service';

@Component({
  selector: 'app-edit-music',
  templateUrl: './edit-music.page.html',
  styleUrls: ['./edit-music.page.scss'],
})
export class EditMusicPage implements OnInit,OnDestroy {
  music: Music;
  musicId: string;
  musicForm: FormGroup;
  private mMusicSub: Subscription;

  constructor(
    private mRoute: ActivatedRoute,
    private mMusicService: MusicService,
    private mNavCtrl: NavController

  ) { }
  ngOnDestroy(){
    if(this.mMusicSub){
      this.mMusicSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.mRoute.paramMap.subscribe(params => {
      if(!params.has('musicId')){
        return;
      }
      else{
        this.musicId = params.get('musicId');
      }
    });
    this.mMusicSub = this.mMusicService.getMusic(this.musicId).subscribe(music => {
      this.music = music;
    });

    this.musicForm = new FormGroup({
      title: new FormControl(this.music.title,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      artist: new FormControl(this.music.artist,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      img: new FormControl(this.music.img,{
        updateOn: 'blur',
      }),
      bpm: new FormControl(this.music.bpm,{
        updateOn:'blur',
        validators: [Validators.required]
      }),
      fav: new FormControl(this.music.fav,{
        updateOn: 'blur',
      })
    });
  }

  onValidate(){
    this.mMusicService.editMusic(this.music, this.musicForm.value.title, this.musicForm.value.artist, this.musicForm.value.bpm, this.musicForm.value.img, this.musicForm.value.fav).subscribe();
    this.navigateBack();

  }

  onCancel(){
    this.navigateBack();
  }


  navigateBack(){
    this.mNavCtrl.navigateBack('/musics/tabs/library/'+this.music.id);
  }
}
