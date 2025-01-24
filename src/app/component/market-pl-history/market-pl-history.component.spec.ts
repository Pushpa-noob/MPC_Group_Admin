import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlHistoryComponent } from './market-pl-history.component';

describe('MarketPlHistoryComponent', () => {
  let component: MarketPlHistoryComponent;
  let fixture: ComponentFixture<MarketPlHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketPlHistoryComponent]
    });
    fixture = TestBed.createComponent(MarketPlHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
