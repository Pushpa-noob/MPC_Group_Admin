import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketWisePlComponent } from './market-wise-pl.component';

describe('MarketWisePlComponent', () => {
  let component: MarketWisePlComponent;
  let fixture: ComponentFixture<MarketWisePlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketWisePlComponent]
    });
    fixture = TestBed.createComponent(MarketWisePlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
