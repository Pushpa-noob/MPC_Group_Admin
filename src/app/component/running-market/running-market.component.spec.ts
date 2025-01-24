import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningMarketComponent } from './running-market.component';

describe('RunningMarketComponent', () => {
  let component: RunningMarketComponent;
  let fixture: ComponentFixture<RunningMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunningMarketComponent]
    });
    fixture = TestBed.createComponent(RunningMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
