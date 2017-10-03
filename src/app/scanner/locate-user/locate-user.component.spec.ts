import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateUserComponent } from './locate-user.component';

describe('LocateUserComponent', () => {
  let component: LocateUserComponent;
  let fixture: ComponentFixture<LocateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocateUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
