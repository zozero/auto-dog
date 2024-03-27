import { TestBed } from '@angular/core/testing';

import { ExecuteResultTableService } from './execute-result-table.service';

describe('ExecuteResultTableService', () => {
  let service: ExecuteResultTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecuteResultTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
