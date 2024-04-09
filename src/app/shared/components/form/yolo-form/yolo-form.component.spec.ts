import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoloFormComponent } from './yolo-form.component';

describe('YoloFormComponent', () => {
  let component: YoloFormComponent;
  let fixture: ComponentFixture<YoloFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoloFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YoloFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
