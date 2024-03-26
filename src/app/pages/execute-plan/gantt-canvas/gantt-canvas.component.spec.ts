import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttCanvasComponent } from './gantt-canvas.component';

describe('GanttCanvasComponent', () => {
  let component: GanttCanvasComponent;
  let fixture: ComponentFixture<GanttCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanttCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GanttCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
