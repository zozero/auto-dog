import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTableComponent as StepTableComponent } from './step-table.component';

describe('StepTableComponent', () => {
  let component: StepTableComponent;
  let fixture: ComponentFixture<StepTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
