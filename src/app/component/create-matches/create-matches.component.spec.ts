import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchesComponent } from './create-matches.component';

describe('CreateMatchesComponent', () => {
  let component: CreateMatchesComponent;
  let fixture: ComponentFixture<CreateMatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMatchesComponent]
    });
    fixture = TestBed.createComponent(CreateMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
