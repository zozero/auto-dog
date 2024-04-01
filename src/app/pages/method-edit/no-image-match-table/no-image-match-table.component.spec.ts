import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoImageMatchTableComponent } from './no-image-match-table.component';

describe('NoImageMatchTableComponent', () => {
  let component: NoImageMatchTableComponent;
  let fixture: ComponentFixture<NoImageMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoImageMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoImageMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
