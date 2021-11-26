import { BehaviorSubject } from 'rxjs';
import { Music } from '../music.model';

export class Playlist{
  constructor(
    public sId: string,
    public sName: string,
    public sUserId: string,
    public musics: Array<Music>,
    public sImg?: string
  ){}

}
