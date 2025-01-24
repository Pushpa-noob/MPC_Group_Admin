import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCheatbetComponent } from './open-cheatbet.component';

describe('OpenCheatbetComponent', () => {
  let component: OpenCheatbetComponent;
  let fixture: ComponentFixture<OpenCheatbetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenCheatbetComponent]
    });
    fixture = TestBed.createComponent(OpenCheatbetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
