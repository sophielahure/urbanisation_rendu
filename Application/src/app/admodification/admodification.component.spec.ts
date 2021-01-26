import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmodificationComponent } from './admodification.component';

describe('AdmodificationComponent', () => {
  let component: AdmodificationComponent;
  let fixture: ComponentFixture<AdmodificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmodificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
