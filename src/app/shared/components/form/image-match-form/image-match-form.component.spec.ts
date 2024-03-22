import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMatchFormComponent } from './image-match-form.component';

describe('ImageMatchFormComponent', () => {
  let component: ImageMatchFormComponent;
  let fixture: ComponentFixture<ImageMatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageMatchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
