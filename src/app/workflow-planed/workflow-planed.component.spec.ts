import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPlanedComponent } from './workflow-planed.component';

describe('WorkflowPlanedComponent', () => {
  let component: WorkflowPlanedComponent;
  let fixture: ComponentFixture<WorkflowPlanedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowPlanedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowPlanedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
