import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LibraryPageRoutingModule } from './library-routing.module';
import { HighlightDirective } from '../../app-highlight.directive';
import { LibraryPage } from './library.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibraryPageRoutingModule
  ],
  declarations: [LibraryPage,HighlightDirective]
})
export class LibraryPageModule {}
