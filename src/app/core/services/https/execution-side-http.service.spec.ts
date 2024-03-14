import { TestBed } from '@angular/core/testing';

import { ExecutionSideHttpService } from './execution-side-http.service';

describe('ExecutionSideHttpService', () => {
  let service: ExecutionSideHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionSideHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
