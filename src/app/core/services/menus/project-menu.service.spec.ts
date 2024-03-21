import { TestBed } from '@angular/core/testing';

import { ProjectMenuService } from './project-menu.service';

describe('MenuService', () => {
  let service: ProjectMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
