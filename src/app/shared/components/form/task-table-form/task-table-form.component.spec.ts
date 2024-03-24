import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTableFormComponent } from './task-table-form.component';

describe('TaskTableFormComponent', () => {
  let component: TaskTableFormComponent;
  let fixture: ComponentFixture<TaskTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTableFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
