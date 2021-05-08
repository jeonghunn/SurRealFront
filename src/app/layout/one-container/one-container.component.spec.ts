import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneContainerComponent } from './one-container.component';

describe('OneContainerComponent', () => {
  let component: OneContainerComponent;
  let fixture: ComponentFixture<OneContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneContainerComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
