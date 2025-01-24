import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptDepositRequestComponent } from './accept-deposit-request.component';

describe('AcceptDepositRequestComponent', () => {
  let component: AcceptDepositRequestComponent;
  let fixture: ComponentFixture<AcceptDepositRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptDepositRequestComponent]
    });
    fixture = TestBed.createComponent(AcceptDepositRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
