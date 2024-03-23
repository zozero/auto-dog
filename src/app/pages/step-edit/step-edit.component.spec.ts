import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEditComponent as StepEditComponent } from './step-edit.component';

describe('StepEditComponent', () => {
  let component: StepEditComponent;
  let fixture: ComponentFixture<StepEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
