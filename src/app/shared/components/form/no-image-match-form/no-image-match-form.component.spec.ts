import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoImageMatchFormComponent } from './no-image-match-form.component';

describe('NoImageMatchFormComponent', () => {
  let component: NoImageMatchFormComponent;
  let fixture: ComponentFixture<NoImageMatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoImageMatchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoImageMatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
