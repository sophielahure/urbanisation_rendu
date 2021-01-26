import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyconnectionComponent } from './companyconnection.component';

describe('CompanyconnectionComponent', () => {
  let component: CompanyconnectionComponent;
  let fixture: ComponentFixture<CompanyconnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyconnectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
