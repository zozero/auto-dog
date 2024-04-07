import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotTabsComponent } from './screenshot-tabs.component';

describe('ScreenshotTabsComponent', () => {
  let component: ScreenshotTabsComponent;
  let fixture: ComponentFixture<ScreenshotTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenshotTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScreenshotTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
