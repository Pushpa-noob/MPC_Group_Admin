import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWisePlHistoryComponent } from './user-wise-pl-history.component';

describe('UserWisePlHistoryComponent', () => {
  let component: UserWisePlHistoryComponent;
  let fixture: ComponentFixture<UserWisePlHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserWisePlHistoryComponent]
    });
    fixture = TestBed.createComponent(UserWisePlHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
