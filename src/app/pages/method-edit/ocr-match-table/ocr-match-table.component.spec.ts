import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrMatchTableComponent } from './ocr-match-table.component';

describe('OcrMatchTableComponent', () => {
  let component: OcrMatchTableComponent;
  let fixture: ComponentFixture<OcrMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcrMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
