import { TestBed } from '@angular/core/testing';

import { ExecuteTableService } from './execute-table.service';

describe('ExecuteTableService', () => {
  let service: ExecuteTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecuteTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
