import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewMusicPageRoutingModule } from './new-music-routing.module';

import { NewMusicPage } from './new-music.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewMusicPageRoutingModule
  ],
  declarations: [NewMusicPage]
})
export class NewMusicPageModule {}
