import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetFailedReasonComponent } from './bet-failed-reason.component';

describe('BetFailedReasonComponent', () => {
  let component: BetFailedReasonComponent;
  let fixture: ComponentFixture<BetFailedReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BetFailedReasonComponent]
    });
    fixture = TestBed.createComponent(BetFailedReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
