import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollbackMatchComponent } from './rollback-match.component';

describe('RollbackMatchComponent', () => {
  let component: RollbackMatchComponent;
  let fixture: ComponentFixture<RollbackMatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollbackMatchComponent]
    });
    fixture = TestBed.createComponent(RollbackMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
