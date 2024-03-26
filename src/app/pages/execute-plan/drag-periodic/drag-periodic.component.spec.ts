import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragPeriodicComponent } from './drag-periodic.component';

describe('DragPeriodicComponent', () => {
  let component: DragPeriodicComponent;
  let fixture: ComponentFixture<DragPeriodicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragPeriodicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragPeriodicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
