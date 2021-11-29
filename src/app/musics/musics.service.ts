/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, from, Observable } from 'rxjs';
import { Music } from './music.model';
import {take, map, tap, switchMap, concatMap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';


interface beatsData{
  artist: string;
  bpm: number;
  fav: boolean;
  id: string;
  img: string;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private mMusics = new BehaviorSubject<Music[]>([]);

  constructor(private httpClient: HttpClient, private authService: AuthService, public afDB: AngularFireDatabase,public afSG: AngularFireStorage){
    this.fetchBeats().subscribe();
  }

  fetchBeats(): Observable<any>{
    return this.authService.userId.pipe(
      switchMap(userId => {
        if(!userId){
          console.error('user not found');
        }
        return this.httpClient.get<{[key: string]: beatsData}>(`https://musics-53932-default-rtdb.europe-west1.firebasedatabase.app/beats.json?orderBy="userId"&equalTo="${userId}"`);
      }),
      map(resData => {
        const musics = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key)){
            musics.push(new Music(key, resData[key].title, resData[key].artist,resData[key].bpm,resData[key].img,resData[key].fav,resData[key].userId));
          }
        }
        return musics;
      }),
      tap(musics => {
        this.mMusics.next(musics);
      })
    );
  }

  get musics(){
    return this.mMusics.asObservable();
  }

  getMusic(musicId: string){
    return this.mMusics.pipe(
      take(1),
      tap(musics => console.log(musics)),
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
    let updatedMusics: Music[];
    return this.musics.pipe(
      take(1),
      switchMap(musics => {
        const newMusic = new Music(oldMusic.id, title, artist, bpm, img, fav, oldMusic.userId);
        const index = musics.findIndex(m => m.id === newMusic.id);
        updatedMusics = [...musics];
        updatedMusics[index] = newMusic;
        return this.httpClient.put(`https://musics-53932-default-rtdb.europe-west1.firebasedatabase.app/beats/${oldMusic.id}.json`, {...newMusic,  id: null});
      }), tap(() => {
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

  newMusic(title: string, artist: string, bpm: number, img: string, fav: boolean): Observable<any>{
    return this.authService.userId.pipe(
      concatMap((userid: string) => {
          const newMusic = new Music('jsd', title, artist, bpm, img, fav, userid);
          return this.httpClient.post('https://musics-53932-default-rtdb.europe-west1.firebasedatabase.app/beats.json', {...newMusic, id: null});
        }
      )
    );
  }

  getBeatStorage(musicTitle: string): Observable<any>{
    return this.afSG.ref(`/beats/${musicTitle}.mp3`).getDownloadURL();
  }

  putBeatStorage(musicFile: File, fileName: string): Observable<any>{
    return from(this.afSG.ref(`/beats/${fileName}`).put(musicFile));
  }
}
