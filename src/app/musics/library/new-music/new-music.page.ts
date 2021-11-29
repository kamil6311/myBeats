/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { concat } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { MusicService } from '../../musics.service';

@Component({
  selector: 'app-new-music',
  templateUrl: './new-music.page.html',
  styleUrls: ['./new-music.page.scss'],
})
export class NewMusicPage implements OnInit {
  musicForm: FormGroup;
  selectedFile = null;
  musicTitle = '';

  constructor(
    private musicService: MusicService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.musicForm = new FormGroup({
      artist: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      bpm: new FormControl(null,{
        updateOn: 'change'
      }),
      file: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      img: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }
  onFileSelected(event){
    this.selectedFile = event.target.files[0];
    this.musicTitle = this.selectedFile.name;
  }

  onClose(){
    this.navCtrl.navigateBack('/musics/tabs/library');
  }

  onValidate(){
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Envoi en cours...' })
      .then(loadingEl => {
        loadingEl.present();
        this.musicService.newMusic(this.musicTitle.replace('.mp3', ''), this.musicForm.value.artist, this.musicForm.value.bpm, this.musicForm.value.img, false).pipe(
          concatMap(() =>
            this.musicService.putBeatStorage(this.selectedFile, this.musicTitle).pipe(
              tap(res => {
                console.log(res);
              })
            )
          ),
          concatMap(() =>
              this.musicService.fetchBeats()
          )
        ).subscribe(
          () => {
            loadingEl.dismiss();
            this.navCtrl.navigateBack('/musics/tabs/library');
          }
        );
      });
  }


}
