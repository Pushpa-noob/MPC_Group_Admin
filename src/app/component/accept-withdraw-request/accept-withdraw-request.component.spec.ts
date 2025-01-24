import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptWithdrawRequestComponent } from './accept-withdraw-request.component';

describe('AcceptWithdrawRequestComponent', () => {
  let component: AcceptWithdrawRequestComponent;
  let fixture: ComponentFixture<AcceptWithdrawRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptWithdrawRequestComponent]
    });
    fixture = TestBed.createComponent(AcceptWithdrawRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
