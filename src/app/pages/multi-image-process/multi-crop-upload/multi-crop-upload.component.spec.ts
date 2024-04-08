import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCropUploadComponent } from './multi-crop-upload.component';

describe('MultiCropUploadComponent', () => {
  let component: MultiCropUploadComponent;
  let fixture: ComponentFixture<MultiCropUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiCropUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiCropUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
