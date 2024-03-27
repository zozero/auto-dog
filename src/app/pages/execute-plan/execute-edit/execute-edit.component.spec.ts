import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteEditComponent } from './execute-edit.component';

describe('ExecuteEditComponent', () => {
  let component: ExecuteEditComponent;
  let fixture: ComponentFixture<ExecuteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecuteEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecuteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
