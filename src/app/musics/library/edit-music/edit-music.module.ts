import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMusicPageRoutingModule } from './edit-music-routing.module';

import { EditMusicPage } from './edit-music.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    EditMusicPageRoutingModule
  ],
  declarations: [EditMusicPage]
})
export class EditMusicPageModule {}
