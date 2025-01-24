import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddEvenComponent } from './odd-even.component';

describe('OddEvenComponent', () => {
  let component: OddEvenComponent;
  let fixture: ComponentFixture<OddEvenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OddEvenComponent]
    });
    fixture = TestBed.createComponent(OddEvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
