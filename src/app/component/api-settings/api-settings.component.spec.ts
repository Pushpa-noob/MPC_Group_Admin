import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSettingsComponent } from './api-settings.component';

describe('ApiSettingsComponent', () => {
  let component: ApiSettingsComponent;
  let fixture: ComponentFixture<ApiSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApiSettingsComponent]
    });
    fixture = TestBed.createComponent(ApiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
