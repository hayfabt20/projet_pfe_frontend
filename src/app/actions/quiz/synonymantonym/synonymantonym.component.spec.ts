import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynonymantonymComponent } from './synonymantonym.component';

describe('SynonymantonymComponent', () => {
  let component: SynonymantonymComponent;
  let fixture: ComponentFixture<SynonymantonymComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SynonymantonymComponent]
    });
    fixture = TestBed.createComponent(SynonymantonymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
