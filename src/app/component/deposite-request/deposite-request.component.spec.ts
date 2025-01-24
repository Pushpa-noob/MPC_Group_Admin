import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositeRequestComponent } from './deposite-request.component';

describe('DepositeRequestComponent', () => {
  let component: DepositeRequestComponent;
  let fixture: ComponentFixture<DepositeRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositeRequestComponent]
    });
    fixture = TestBed.createComponent(DepositeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
