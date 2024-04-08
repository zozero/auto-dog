import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiImageMatchFormComponent } from './multi-image-match-form.component';

describe('MultiImageMatchFormComponent', () => {
  let component: MultiImageMatchFormComponent;
  let fixture: ComponentFixture<MultiImageMatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiImageMatchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiImageMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
