import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectTableDialogComponent } from './add-project-table-dialog.component';

describe('AddProjectTableDialogComponent', () => {
  let component: AddProjectTableDialogComponent;
  let fixture: ComponentFixture<AddProjectTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectTableDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProjectTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
