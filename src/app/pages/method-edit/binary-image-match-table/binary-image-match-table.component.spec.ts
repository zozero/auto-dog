import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryImageMatchTableComponent } from './binary-image-match-table.component';

describe('BinaryImageMatchTableComponent', () => {
  let component: BinaryImageMatchTableComponent;
  let fixture: ComponentFixture<BinaryImageMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinaryImageMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BinaryImageMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
