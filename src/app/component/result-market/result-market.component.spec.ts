import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultMarketComponent } from './result-market.component';

describe('ResultMarketComponent', () => {
  let component: ResultMarketComponent;
  let fixture: ComponentFixture<ResultMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultMarketComponent]
    });
    fixture = TestBed.createComponent(ResultMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
