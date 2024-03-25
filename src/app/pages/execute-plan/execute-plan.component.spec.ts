import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutePlanComponent } from './execute-plan.component';

describe('ExecutePlanComponent', () => {
  let component: ExecutePlanComponent;
  let fixture: ComponentFixture<ExecutePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
