import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStepInImageDialogComponent } from './add-step-in-image-dialog.component';

describe('AddStepInImageDialogComponent', () => {
  let component: AddStepInImageDialogComponent;
  let fixture: ComponentFixture<AddStepInImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStepInImageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddStepInImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
