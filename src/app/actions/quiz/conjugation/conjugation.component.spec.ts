import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConjugationComponent } from './conjugation.component';

describe('ConjugationComponent', () => {
  let component: ConjugationComponent;
  let fixture: ComponentFixture<ConjugationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConjugationComponent]
    });
    fixture = TestBed.createComponent(ConjugationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
