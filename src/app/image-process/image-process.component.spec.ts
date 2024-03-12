import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageProcessComponent } from './image-process.component';

describe('ImageProcessComponent', () => {
  let component: ImageProcessComponent;
  let fixture: ComponentFixture<ImageProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
