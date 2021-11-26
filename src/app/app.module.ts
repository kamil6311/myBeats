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


@NgModule({
  declarations: [AppComponent,PopOverPage,AddMusicToPlaylistComponent, LikedDirective],
  entryComponents: [],
  imports: [CommonModule,BrowserModule,FormsModule,ReactiveFormsModule, IonicModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}),HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
