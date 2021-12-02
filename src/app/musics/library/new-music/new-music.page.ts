/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { concat } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
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
  progressBarValue = 0;

  constructor(
    private musicService: MusicService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
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
          tap(() =>
            this.musicService.putBeatStorage(this.selectedFile, this.musicTitle).on('state_changed',
              (snap) => {
                console.log(snap.bytesTransferred/snap.totalBytes);
                this.progressBarValue = (snap.bytesTransferred/snap.totalBytes);
              },
              (error) => {
                console.log('upload error');
                  loadingEl.dismiss();
                const code = error.message;
                const message = 'Erreur d`importation du fichier';
                this.showAlert(message);
              },
              () => {
                console.log('upload finished');
                loadingEl.message = 'Récupération des données...';
                this.musicService.fetchBeats().pipe(tap(() => {
                  loadingEl.dismiss();
                  this.navCtrl.navigateBack('/musics/tabs/library');
                })).subscribe();
              }
            )
          )
        ).subscribe();
      });
  }


  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
