import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollbackFancyComponent } from './rollback-fancy.component';

describe('RollbackFancyComponent', () => {
  let component: RollbackFancyComponent;
  let fixture: ComponentFixture<RollbackFancyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollbackFancyComponent]
    });
    fixture = TestBed.createComponent(RollbackFancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
