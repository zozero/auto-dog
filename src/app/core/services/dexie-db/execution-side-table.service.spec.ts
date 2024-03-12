import { TestBed } from '@angular/core/testing';

import { ExecutionSideTableService } from './execution-side-table.service';

describe('ExecutionSideTableService', () => {
  let service: ExecutionSideTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionSideTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
