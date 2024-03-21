import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMatchTableComponent } from './image-match-table.component';

describe('ImageMatchTableComponent', () => {
  let component: ImageMatchTableComponent;
  let fixture: ComponentFixture<ImageMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
