/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Music } from '../musics/music.model';

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  private basicMusic = new Music('', '', '', 0, 'assets/icon/music2.png', false, '');

  private _playingMusic = new BehaviorSubject<Music>(this.basicMusic);

  playingMusic = this._playingMusic.asObservable();

  constructor() { }


  setPlayingMusic(music: Music){
    this._playingMusic.next(music);
  }

}
