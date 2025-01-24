import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardSettingsComponent } from './keyboard-settings.component';

describe('KeyboardSettingsComponent', () => {
  let component: KeyboardSettingsComponent;
  let fixture: ComponentFixture<KeyboardSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyboardSettingsComponent]
    });
    fixture = TestBed.createComponent(KeyboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
