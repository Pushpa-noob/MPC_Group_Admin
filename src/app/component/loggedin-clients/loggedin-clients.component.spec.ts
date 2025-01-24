import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedinClientsComponent } from './loggedin-clients.component';

describe('LoggedinClientsComponent', () => {
  let component: LoggedinClientsComponent;
  let fixture: ComponentFixture<LoggedinClientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedinClientsComponent]
    });
    fixture = TestBed.createComponent(LoggedinClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
