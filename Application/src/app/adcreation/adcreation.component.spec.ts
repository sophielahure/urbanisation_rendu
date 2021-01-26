import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdcreationComponent } from './adcreation.component';

describe('AdcreationComponent', () => {
  let component: AdcreationComponent;
  let fixture: ComponentFixture<AdcreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdcreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
