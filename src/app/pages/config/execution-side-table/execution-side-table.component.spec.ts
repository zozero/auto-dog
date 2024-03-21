import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionSideTableComponent } from './execution-side-table.component';

describe('ExecutionSideTableComponent', () => {
  let component: ExecutionSideTableComponent;
  let fixture: ComponentFixture<ExecutionSideTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionSideTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutionSideTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
