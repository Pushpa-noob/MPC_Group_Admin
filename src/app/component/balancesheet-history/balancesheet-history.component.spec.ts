import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancesheetHistoryComponent } from './balancesheet-history.component';

describe('BalancesheetHistoryComponent', () => {
  let component: BalancesheetHistoryComponent;
  let fixture: ComponentFixture<BalancesheetHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalancesheetHistoryComponent]
    });
    fixture = TestBed.createComponent(BalancesheetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
