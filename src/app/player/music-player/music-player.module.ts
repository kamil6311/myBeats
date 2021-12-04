import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicPlayerPageRoutingModule } from './music-player-routing.module';

import { MusicPlayerPage } from './music-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    MusicPlayerPageRoutingModule
  ],
  declarations: [MusicPlayerPage]
})
export class MusicPlayerPageModule {}
