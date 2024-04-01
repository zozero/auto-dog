import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAndMatchFormComponent } from './match-and-match-form.component';

describe('MatchAndMatchFormComponent', () => {
  let component: MatchAndMatchFormComponent;
  let fixture: ComponentFixture<MatchAndMatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchAndMatchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchAndMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
