import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyregistrationComponent } from './companyregistration.component';

describe('CompanyregistrationComponent', () => {
  let component: CompanyregistrationComponent;
  let fixture: ComponentFixture<CompanyregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyregistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
