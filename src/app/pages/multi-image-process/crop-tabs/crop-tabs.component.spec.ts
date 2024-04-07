import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropTabsComponent } from './crop-tabs.component';

describe('CropTabsComponent', () => {
  let component: CropTabsComponent;
  let fixture: ComponentFixture<CropTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CropTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
