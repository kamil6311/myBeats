/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Music } from './music.model';
import {take, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicService {


  private mMusics = new BehaviorSubject<Music[]>([
    new Music(
      'm1',
      'musique1',
      'Kams',
      150,
      'https://media.gettyimages.com/photos/cars-parked-on-road-by-buildings-picture-id652955141?k=20&m=652955141&s=612x612&w=0&h=KDOjGukrs31iWhoyxNryhzjQ7mNbntwjgg3kQ2tuwpc=',
      true,
      ),
      new Music(
      'm2',
      '2musique',
      'Kams',
      111,
      'https://media.gettyimages.com/photos/cars-parked-on-road-by-buildings-picture-id652955141?k=20&m=652955141&s=612x612&w=0&h=KDOjGukrs31iWhoyxNryhzjQ7mNbntwjgg3kQ2tuwpc=',
      false
      )
  ]);


  constructor(){
  }



  get musics(){
    return this.mMusics.asObservable();
  }



  getMusic(musicId: string){
    return this.musics.pipe(
      take(1),
      map(musics => ({...musics.find(m => m.id === musicId)}))
    );
  }

  getMusicByTitle(title: string){
    return this.mMusics.pipe(
      map(musics => musics.filter(m => m.title.startsWith(title)))
    );
  }

  musicTriggerFav(musicSelected: Music, fav: boolean){
    return this.mMusics.pipe(
      take(1),
      tap(musics => {
        const updatedMusicIndex = musics.findIndex(music => music.id === musicSelected.id);
        const updatedMusics = [...musics];
        const oldMusic = updatedMusics[updatedMusicIndex];
        oldMusic.fav = fav;
        updatedMusics[updatedMusicIndex] = oldMusic;
        this.mMusics.next(updatedMusics);
      })
    );
  }

  editMusic(oldMusic: Music, title: string, artist: string, bpm: number, img: string, fav: boolean){
    const newMusic = new Music(oldMusic.id, title, artist, bpm, img, fav);
    return this.musics.pipe(
      take(1),
      tap(musics => {
        const index = musics.findIndex(m => m.id === newMusic.id);
        const updatedMusics = musics;
        updatedMusics[index] = newMusic;
        this.mMusics.next(updatedMusics);
      })
    );
  }

  editMusicF(newMusic: Music){
    return this.musics.pipe(
      take(1),
      tap(musics => {
        const index = musics.findIndex(m => m.id === newMusic.id);
        const updatedMusics = [...musics];
        updatedMusics[index] = newMusic;
        this.mMusics.next(updatedMusics);
      })
    );
  }


}
