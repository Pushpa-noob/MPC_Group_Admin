import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashStatementHistoryComponent } from './cash-statement-history.component';

describe('CashStatementHistoryComponent', () => {
  let component: CashStatementHistoryComponent;
  let fixture: ComponentFixture<CashStatementHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashStatementHistoryComponent]
    });
    fixture = TestBed.createComponent(CashStatementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
