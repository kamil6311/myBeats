/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Playlist } from '../playlist.model';
import { PlaylistsService } from '../playlists.service';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.page.html',
  styleUrls: ['./edit-playlist.page.scss'],
})
export class EditPlaylistPage implements OnInit,OnDestroy {
  playlist: Playlist;
  playlistForm: FormGroup;
  private mPlaylistSub: Subscription;
  private msPlaylistId: string;

  constructor(
    private mRoute: ActivatedRoute,
    private mPlaylistService: PlaylistsService,
    private mNavCtrl: NavController
  ) { }

  ngOnInit() {
    this.mRoute.paramMap.subscribe(params => {
      if(!params.has('playlistId')){
        return;
      }
      else{
        this.msPlaylistId = params.get('playlistId');
      }
    });
    this.mPlaylistSub = this.mPlaylistService.getPlaylist(this.msPlaylistId).subscribe(
      playlist => this.playlist = playlist
    );

    this.playlistForm = new FormGroup({
      title: new FormControl(this.playlist.sName,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      img: new FormControl(this.playlist.sImg,{
        updateOn: 'blur',
      })
    });
  }

  onClose(){
    this.navigateBack();
  }
  onValidate(){
    this.mPlaylistSub = this.mPlaylistService.editPlaylist(this.playlistForm.value.title, this.playlistForm.value.img, this.playlist).subscribe();
    this.navigateBack();
  }

  navigateBack(){
    this.mNavCtrl.navigateBack('/musics/tabs/playlists/'+this.playlist.sId);
  }

  ngOnDestroy(){
    if(this.mPlaylistSub){
      this.mPlaylistSub.unsubscribe();
    }
  }

}
