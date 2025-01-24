import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerUploadComponent } from './banner-upload.component';

describe('BannerUploadComponent', () => {
  let component: BannerUploadComponent;
  let fixture: ComponentFixture<BannerUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerUploadComponent]
    });
    fixture = TestBed.createComponent(BannerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
