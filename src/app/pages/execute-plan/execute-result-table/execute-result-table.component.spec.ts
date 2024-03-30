import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteResultTableComponent } from './execute-result-table.component';

describe('ExecuteResultTableComponent', () => {
  let component: ExecuteResultTableComponent;
  let fixture: ComponentFixture<ExecuteResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecuteResultTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecuteResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
