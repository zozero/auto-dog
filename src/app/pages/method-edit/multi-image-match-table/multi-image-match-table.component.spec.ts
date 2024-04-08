import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiImageMatchTableComponent } from './multi-image-match-table.component';

describe('MultiImageMatchTableComponent', () => {
  let component: MultiImageMatchTableComponent;
  let fixture: ComponentFixture<MultiImageMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiImageMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiImageMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
