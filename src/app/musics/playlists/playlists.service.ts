/* eslint-disable max-len */
import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Music } from '../music.model';
import { Playlist } from './playlist.model';
import {map, mapTo, take, tap} from 'rxjs/operators';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { MusicService } from '../musics.service';

@Injectable({
  providedIn: 'root'
})

export class PlaylistsService{
  m1 = new Music(
    'm1',
    '1Musique',
    'Kams',
    150,
    'https://media.gettyimages.com/photos/cars-parked-on-road-by-buildings-picture-id652955141?k=20&m=652955141&s=612x612&w=0&h=KDOjGukrs31iWhoyxNryhzjQ7mNbntwjgg3kQ2tuwpc=',
    true,
    'kams'
  );

  m2 = new Music(
      'm2',
      'Musique2 ',
      'Kams',
      111,
      'https://media.gettyimages.com/photos/cars-parked-on-road-by-buildings-picture-id652955141?k=20&m=652955141&s=612x612&w=0&h=KDOjGukrs31iWhoyxNryhzjQ7mNbntwjgg3kQ2tuwpc=',
      false,
      'kams'
  );
  private mMusics: Array<Music>;
  private mMusicSub: Subscription;


  private mPlaylists = new BehaviorSubject<Playlist[]>([
    new Playlist(
      'p1',
      'ma playlist perso',
      'kams',
      [this.m1,this.m2],
      'https://media.gettyimages.com/photos/composite-sunset-time-lapse-skyline-view-of-san-francisco-california-picture-id1338130355?s=2048x2048'
    ),
    new Playlist(
      'p2',
      'Playlist 2',
      'kams',
      [this.m1],
      'https://logo-marque.com/wp-content/uploads/2021/04/Youtube-Music-Logo.png'
    )
  ]);

  constructor(private mMusicService: MusicService){
    this.mMusicSub = this.mMusicService.musics.subscribe(
      musics => this.mMusics = musics
    );
  }

  getMusics(){
  }

  get playlists(){
    return this.mPlaylists.asObservable();
  }

  getPlaylist(playlistId: string){
   return this.playlists.pipe(take(1), map(playlists =>(
      {...playlists.find(p => p.sId === playlistId)}))
    );
  }

  addMusic(playlistSelected: Playlist, music: Music){
    return this.playlists.pipe(
      take(1),
      tap(playlists => {
        const playlistIndex = playlists.findIndex(p => p.sId === playlistSelected.sId);
        const updatedPlaylists = [...playlists];
        updatedPlaylists[playlistIndex].musics.push(music);
        this.mPlaylists.next(updatedPlaylists);
      })
    );
  }

  addPlaylist(title: string, userId: string, img: string){
    const newPlaylist = new Playlist(Math.random().toString(), title, userId, [], img);
    return this.playlists.pipe(
      take(1),
      tap(playlists => {
        this.mPlaylists.next(playlists.concat(newPlaylist));
      })
    );
  }

  editPlaylist(title: string, img: string, old: Playlist){
    const newPlaylist = new Playlist(old.sId, title, old.sUserId, old.musics, img);
    return this.playlists.pipe(
      take(1),
      tap(playlists => {
        const updatedPlaylistIndex = playlists.findIndex(p => p.sId === newPlaylist.sId);
        const updatedPlaylists = [...playlists];
        updatedPlaylists[updatedPlaylistIndex] = newPlaylist;
        this.mPlaylists.next(updatedPlaylists);
      })
    );
  }
}
