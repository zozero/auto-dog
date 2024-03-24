import { TestBed } from '@angular/core/testing';

import { ExecutionHttpService } from './execution-http.service';

describe('ExecutionHttpService', () => {
  let service: ExecutionHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
