import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorTableDialogComponent } from './simulator-table-dialog.component';

describe('SimulatorTableDialogComponent', () => {
  let component: SimulatorTableDialogComponent;
  let fixture: ComponentFixture<SimulatorTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorTableDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulatorTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
