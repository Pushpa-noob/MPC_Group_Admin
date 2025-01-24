import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerLoserComponent } from './winner-loser.component';

describe('WinnerLoserComponent', () => {
  let component: WinnerLoserComponent;
  let fixture: ComponentFixture<WinnerLoserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WinnerLoserComponent]
    });
    fixture = TestBed.createComponent(WinnerLoserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
