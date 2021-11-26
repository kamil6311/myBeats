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


@NgModule({
  declarations: [AppComponent,PopOverPage,AddMusicToPlaylistComponent, LikedDirective],
  entryComponents: [],
  imports: [CommonModule,BrowserModule,FormsModule,ReactiveFormsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
