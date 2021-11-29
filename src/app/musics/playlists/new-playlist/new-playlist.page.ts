import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.page.html',
  styleUrls: ['./new-playlist.page.scss'],
})
export class NewPlaylistPage implements OnInit {
  pForm: FormGroup;

  constructor(
    private mModal: ModalController
  ) { }

  ngOnInit() {
    this.pForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      img: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onValidate(){
    this.mModal.dismiss({
      playlistData: {
        title: this.pForm.value.title,
        img: this.pForm.value.img
      }
    },'confirm');
  }

  onClose(){
    this.mModal.dismiss(null, 'cancel');
  }
}
