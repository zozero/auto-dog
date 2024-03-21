import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMenusComponent } from './project-menus.component';

describe('SubMenusComponent', () => {
  let component: ProjectMenusComponent;
  let fixture: ComponentFixture<ProjectMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMenusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
