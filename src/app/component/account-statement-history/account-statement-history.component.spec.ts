import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatementHistoryComponent } from './account-statement-history.component';

describe('AccountStatementHistoryComponent', () => {
  let component: AccountStatementHistoryComponent;
  let fixture: ComponentFixture<AccountStatementHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountStatementHistoryComponent]
    });
    fixture = TestBed.createComponent(AccountStatementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
