import { OnDestroy, OnInit } from '@angular/core';
import { Music } from '../music.model';
import { MusicService } from '../musics.service';
import { fromEvent, Subscription } from 'rxjs';

import { Component } from '@angular/core';
import { IonSearchbar, PopoverController } from '@ionic/angular';

import { PopOverPage } from 'src/app/components/pop-over/pop-over.page';
import { SearchbarChangeEventDetail, SegmentChangeEventDetail } from '@ionic/core';
import { last } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit, OnDestroy {
  searchInput: string;
  sInput = '';
  musics: Music[];
  lesMusics: Music[];
  segment: string;
  musicSearch: Music[];

  input = document.querySelector('ion-searchbar');

  private mMusicSub: Subscription;
  private mMusicSearchSub: Subscription;
  private mbOptionClicked = false;


  constructor(private mMusicService: MusicService,
    private mPopOverCtrl: PopoverController,
    private mRouter: Router
    ) { }


  ngOnInit() {
    this.mMusicSub = this.mMusicService.musics.subscribe(musics =>{
      this.lesMusics = musics;
      this.musics = this.lesMusics;
      this.segment = 'all';
      this.musicSearch = this.musics;
    });
  }

  ngOnDestroy(){
    if(this.mMusicSub){
      this.mMusicSub.unsubscribe();
    }
    if(this.mMusicSearchSub){
      this.mMusicSearchSub.unsubscribe();
    }
  }

  selectionChanged(event: CustomEvent<SegmentChangeEventDetail>){
    if(event.detail.value === 'all'){
      this.musics = this.lesMusics;
    }
    else{
      this.musics = this.lesMusics.filter(m => m.fav === true);
    }
  }

  itemClicked(musicId: string){
    if(this.mbOptionClicked === true){
      return;
    }
    else{
      this.mRouter.navigateByUrl('musics/tabs/library/'+ musicId);
    }
  }

  async onOptionMusicClick(musicId: string, ev: Event, musicSelected: Music){
    this.mbOptionClicked = true;
    const popOver = this.mPopOverCtrl.create({
      component: PopOverPage,
      showBackdrop: true,
      translucent: true,
      event: ev,
      animated: true,
      componentProps: {id: musicId}
    });
    (await popOver).present();

    const dismissrole = ((await (await popOver).onDidDismiss()).role);

    if(dismissrole === 'favClosed'){
      if(this.lesMusics.filter(m => m.fav === true).length === 0){
          this.segment = 'all';
        }
      else{
          this.segment = 'fav';
      }
    }
    this.mbOptionClicked = false;
  }

  updateSearchResults(ev: KeyboardEvent){
      console.log(this.searchInput);
      this.mMusicSearchSub = this.mMusicService.getMusicByTitle(this.searchInput).subscribe(musics => {
      this.musicSearch = musics;
      this.musics = this.musicSearch;
    });
  }
}
