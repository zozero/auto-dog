import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpSelectComponent } from './http-select.component';

describe('HttpSelectComponent', () => {
  let component: HttpSelectComponent;
  let fixture: ComponentFixture<HttpSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HttpSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
