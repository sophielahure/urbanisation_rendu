import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecherchevideoComponent } from './recherchevideo.component';

describe('RecherchevideoComponent', () => {
  let component: RecherchevideoComponent;
  let fixture: ComponentFixture<RecherchevideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecherchevideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecherchevideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
