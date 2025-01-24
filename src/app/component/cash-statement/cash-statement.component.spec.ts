import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashStatementComponent } from './cash-statement.component';

describe('CashStatementComponent', () => {
  let component: CashStatementComponent;
  let fixture: ComponentFixture<CashStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashStatementComponent]
    });
    fixture = TestBed.createComponent(CashStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
