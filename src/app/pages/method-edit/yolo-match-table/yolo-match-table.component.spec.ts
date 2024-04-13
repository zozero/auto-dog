import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoloMatchTableComponent } from './yolo-match-table.component';

describe('YoloMatchTableComponent', () => {
  let component: YoloMatchTableComponent;
  let fixture: ComponentFixture<YoloMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoloMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YoloMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
