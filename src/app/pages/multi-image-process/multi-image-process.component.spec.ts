import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiImageProcessComponent } from './multi-image-process.component';

describe('MultiImageProcessComponent', () => {
  let component: MultiImageProcessComponent;
  let fixture: ComponentFixture<MultiImageProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiImageProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiImageProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
