import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicsPageRoutingModule } from './musics-routing.module';

import { MusicsPage } from './musics.page';
import { PlayerComponent } from '../player/playerComponent/player/player.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    MusicsPageRoutingModule
  ],
  declarations: [MusicsPage,PlayerComponent]
})
export class MusicsPageModule {}
