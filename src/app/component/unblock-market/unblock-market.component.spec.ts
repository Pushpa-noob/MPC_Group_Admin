import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockMarketComponent } from './unblock-market.component';

describe('UnblockMarketComponent', () => {
  let component: UnblockMarketComponent;
  let fixture: ComponentFixture<UnblockMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnblockMarketComponent]
    });
    fixture = TestBed.createComponent(UnblockMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
