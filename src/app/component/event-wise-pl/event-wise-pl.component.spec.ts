import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWisePlComponent } from './event-wise-pl.component';

describe('EventWisePlComponent', () => {
  let component: EventWisePlComponent;
  let fixture: ComponentFixture<EventWisePlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventWisePlComponent]
    });
    fixture = TestBed.createComponent(EventWisePlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
