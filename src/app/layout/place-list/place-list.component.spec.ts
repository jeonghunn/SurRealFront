import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceListComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: PlaceListComponent;
  let fixture: ComponentFixture<PlaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceListComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
