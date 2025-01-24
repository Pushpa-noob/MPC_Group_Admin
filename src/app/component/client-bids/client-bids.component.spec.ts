import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBidsComponent } from './client-bids.component';

describe('ClientBidsComponent', () => {
  let component: ClientBidsComponent;
  let fixture: ComponentFixture<ClientBidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientBidsComponent]
    });
    fixture = TestBed.createComponent(ClientBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
