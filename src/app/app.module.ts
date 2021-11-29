/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PopOverPage } from './components/pop-over/pop-over.page';
import { AddMusicToPlaylistComponent } from './musics/playlists/add-music-to-playlist/add-music-to-playlist.component';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LikedDirective } from './directives/liked.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { Media } from '@ionic-native/media/ngx';

const firebaseConfig = {
  apiKey: 'AIzaSyAPxa3EWErubDi24ZGFaSQK2pijVYJuUiA',
  authDomain: 'musics-53932.firebaseapp.com',
  databaseURL: 'https://musics-53932-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'musics-53932',
  storageBucket: 'musics-53932.appspot.com',
  messagingSenderId: '1033499558458',
  appId: '1:1033499558458:web:d6db4e8609f27c5648ab03',
  measurementId: 'G-Z4TRQ3YM8B'
};

@NgModule({
  declarations: [AppComponent,PopOverPage,AddMusicToPlaylistComponent, LikedDirective],
  entryComponents: [],
  imports: [CommonModule,BrowserModule,HttpClientModule,FormsModule,ReactiveFormsModule, IonicModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}),HttpClientModule,
  AngularFireModule.initializeApp(firebaseConfig),
  AngularFireDatabaseModule,
  AngularFireStorageModule,
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Media],
  bootstrap: [AppComponent],
})
export class AppModule {}
