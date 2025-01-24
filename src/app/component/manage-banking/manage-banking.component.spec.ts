import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBankingComponent } from './manage-banking.component';

describe('ManageBankingComponent', () => {
  let component: ManageBankingComponent;
  let fixture: ComponentFixture<ManageBankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageBankingComponent]
    });
    fixture = TestBed.createComponent(ManageBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
