import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoViewerComponent } from './video-viewer.component';

describe('VideoViewerComponent', () => {
  let component: VideoViewerComponent;
  let fixture: ComponentFixture<VideoViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoViewerComponent]
    });
    fixture = TestBed.createComponent(VideoViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
