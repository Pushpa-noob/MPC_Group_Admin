import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBethistoryComponent } from './client-bethistory.component';

describe('ClientBethistoryComponent', () => {
  let component: ClientBethistoryComponent;
  let fixture: ComponentFixture<ClientBethistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientBethistoryComponent]
    });
    fixture = TestBed.createComponent(ClientBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
