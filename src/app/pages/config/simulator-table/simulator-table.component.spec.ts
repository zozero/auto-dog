import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorTableComponent } from './simulator-table.component';

describe('SimulatorTableComponent', () => {
  let component: SimulatorTableComponent;
  let fixture: ComponentFixture<SimulatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
