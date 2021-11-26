import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AddMusicToPlaylistComponent } from './add-music-to-playlist.component';

describe('AddMusicToPlaylistComponent', () => {
  let component: AddMusicToPlaylistComponent;
  let fixture: ComponentFixture<AddMusicToPlaylistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMusicToPlaylistComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMusicToPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
