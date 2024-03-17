import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvEditComponent } from './csv-edit.component';

describe('CsvEditComponent', () => {
  let component: CsvEditComponent;
  let fixture: ComponentFixture<CsvEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CsvEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
