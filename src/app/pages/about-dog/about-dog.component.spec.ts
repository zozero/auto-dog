import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDogComponent } from './about-dog.component';

describe('AboutDogComponent', () => {
  let component: AboutDogComponent;
  let fixture: ComponentFixture<AboutDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutDogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
