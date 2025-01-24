import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingMethodComponent } from './banking-method.component';

describe('BankingMethodComponent', () => {
  let component: BankingMethodComponent;
  let fixture: ComponentFixture<BankingMethodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankingMethodComponent]
    });
    fixture = TestBed.createComponent(BankingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
