import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetpEditComponent } from './setp-edit.component';

describe('SetpEditComponent', () => {
  let component: SetpEditComponent;
  let fixture: ComponentFixture<SetpEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetpEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
