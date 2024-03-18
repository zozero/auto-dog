import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropImageUploadComponent } from './crop-image-upload.component';

describe('CropImageUploadComponent', () => {
  let component: CropImageUploadComponent;
  let fixture: ComponentFixture<CropImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropImageUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CropImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
