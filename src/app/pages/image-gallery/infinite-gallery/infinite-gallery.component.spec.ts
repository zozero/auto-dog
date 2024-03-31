import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteGalleryComponent } from './infinite-gallery.component';

describe('InfiniteGalleryComponent', () => {
  let component: InfiniteGalleryComponent;
  let fixture: ComponentFixture<InfiniteGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfiniteGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
