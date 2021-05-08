import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BigerrorComponent } from './bigerror.component';

describe('BigerrorComponent', () => {
  let component: BigerrorComponent;
  let fixture: ComponentFixture<BigerrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BigerrorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
