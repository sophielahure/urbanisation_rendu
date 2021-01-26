import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilplaylistComponent } from './accueilplaylist.component';

describe('AccueilplaylistComponent', () => {
  let component: AccueilplaylistComponent;
  let fixture: ComponentFixture<AccueilplaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccueilplaylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilplaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
