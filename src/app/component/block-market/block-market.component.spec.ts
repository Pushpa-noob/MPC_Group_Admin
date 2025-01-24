import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockMarketComponent } from './block-market.component';

describe('BlockMarketComponent', () => {
  let component: BlockMarketComponent;
  let fixture: ComponentFixture<BlockMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockMarketComponent]
    });
    fixture = TestBed.createComponent(BlockMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
