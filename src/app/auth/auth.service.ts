/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService{
  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  get isUserAuth(){
    return this._user.asObservable().pipe(
      map(user => {
        if(user){
          return !!user.token;
        }else{
          return false;
        }
      }));
  }

  get userId(){
    return this._user.asObservable().pipe(map(user => {
      if(user){
        return user.id;
      }
      else{
        return null;
      }
    }));
  }

  login(email: string, password: string){
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`
      ,{email: email,password: password, returnSecureToken: true}
    ).pipe(tap((data: any) => {
      const expirationTime = new Date(new Date().getTime() + data.expiresIn * 1000);
      this._user.next(new User(data.localId, data.email, data.idToken, expirationTime));
    }));
  }

  logout(){
    this._user.next(null);
  }

  signup(email: string, password: string){
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`
      ,{email: email,password: password, returnSecureToken: true}
    ).pipe(tap((data: any) => {
      const expirationTime = new Date(new Date().getTime() + data.expiresIn * 1000);
      this._user.next(new User(data.localId, data.email, data.idToken, expirationTime));
    }));
  }
}
