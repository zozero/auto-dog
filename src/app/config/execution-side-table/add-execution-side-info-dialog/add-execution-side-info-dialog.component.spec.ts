import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExecutionSideInfoDialogComponent } from './add-execution-side-info-dialog.component';

describe('AddExecutionSideInfoDialogComponent', () => {
  let component: AddExecutionSideInfoDialogComponent;
  let fixture: ComponentFixture<AddExecutionSideInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExecutionSideInfoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExecutionSideInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
