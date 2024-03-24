import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskFileDialogComponent } from './create-task-file-dialog.component';

describe('CreateTaskFileDialogComponent', () => {
  let component: CreateTaskFileDialogComponent;
  let fixture: ComponentFixture<CreateTaskFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskFileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTaskFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
