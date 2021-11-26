import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.page.html',
  styleUrls: ['./new-playlist.page.scss'],
})
export class NewPlaylistPage implements OnInit {
  playlistForm: FormGroup;

  constructor(
    private mModal: ModalController

  ) { }

  ngOnInit() {
    this.playlistForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      img: new FormControl(null, {
        updateOn: 'blur'
      })
    });
  }

  onValidate(){
    this.mModal.dismiss({
      playlistData: {
        title: this.playlistForm.value.title,
        img: this.playlistForm.value.img
      }
    },'confirm');
  }

  onClose(){
    this.mModal.dismiss(null, 'cancel');
  }
}
