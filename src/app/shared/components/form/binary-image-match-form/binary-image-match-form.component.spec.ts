import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryImageMatchFormComponent } from './binary-image-match-form.component';

describe('BinaryImageMatchFormComponent', () => {
  let component: BinaryImageMatchFormComponent;
  let fixture: ComponentFixture<BinaryImageMatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinaryImageMatchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BinaryImageMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
