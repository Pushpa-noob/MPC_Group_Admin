import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultFancyComponent } from './result-fancy.component';

describe('ResultFancyComponent', () => {
  let component: ResultFancyComponent;
  let fixture: ComponentFixture<ResultFancyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultFancyComponent]
    });
    fixture = TestBed.createComponent(ResultFancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
