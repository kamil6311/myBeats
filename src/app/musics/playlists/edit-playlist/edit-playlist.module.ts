import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPlaylistPageRoutingModule } from './edit-playlist-routing.module';

import { EditPlaylistPage } from './edit-playlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    EditPlaylistPageRoutingModule
  ],
  declarations: [EditPlaylistPage]
})
export class EditPlaylistPageModule {}
