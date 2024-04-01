import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAndMatchTableComponent } from './match-and-match-table.component';

describe('MatchAndMatchTableComponent', () => {
  let component: MatchAndMatchTableComponent;
  let fixture: ComponentFixture<MatchAndMatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchAndMatchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchAndMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
