import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSelectModalComponent } from './text-select-modal.component';

describe('TextSelectModalComponent', () => {
  let component: TextSelectModalComponent;
  let fixture: ComponentFixture<TextSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSelectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
