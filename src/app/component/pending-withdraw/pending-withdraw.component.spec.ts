import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingWithdrawComponent } from './pending-withdraw.component';

describe('PendingWithdrawComponent', () => {
  let component: PendingWithdrawComponent;
  let fixture: ComponentFixture<PendingWithdrawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingWithdrawComponent]
    });
    fixture = TestBed.createComponent(PendingWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
