import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserconnectionComponent } from './userconnection.component';

describe('UserconnectionComponent', () => {
  let component: UserconnectionComponent;
  let fixture: ComponentFixture<UserconnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserconnectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
