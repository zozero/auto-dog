import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTableFormComponent } from './step-table-form.component';

describe('StepTableFormComponent', () => {
  let component: StepTableFormComponent;
  let fixture: ComponentFixture<StepTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepTableFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
