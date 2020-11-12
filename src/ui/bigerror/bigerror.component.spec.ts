import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigerrorComponent } from './bigerror.component';

describe('BigerrorComponent', () => {
  let component: BigerrorComponent;
  let fixture: ComponentFixture<BigerrorComponent>;

  beforeEach(async(() => {
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
