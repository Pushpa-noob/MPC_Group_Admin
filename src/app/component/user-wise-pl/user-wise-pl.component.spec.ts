import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWisePlComponent } from './user-wise-pl.component';

describe('UserWisePlComponent', () => {
  let component: UserWisePlComponent;
  let fixture: ComponentFixture<UserWisePlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserWisePlComponent]
    });
    fixture = TestBed.createComponent(UserWisePlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
