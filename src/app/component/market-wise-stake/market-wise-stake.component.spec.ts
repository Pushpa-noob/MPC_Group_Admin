import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketWiseStakeComponent } from './market-wise-stake.component';

describe('MarketWiseStakeComponent', () => {
  let component: MarketWiseStakeComponent;
  let fixture: ComponentFixture<MarketWiseStakeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketWiseStakeComponent]
    });
    fixture = TestBed.createComponent(MarketWiseStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
