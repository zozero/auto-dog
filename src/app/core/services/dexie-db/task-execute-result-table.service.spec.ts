import { TestBed } from '@angular/core/testing';

import { TaskExecuteResultTableService } from './task-execute-result-table.service';

describe('ExecuteResultTableService', () => {
  let service: TaskExecuteResultTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskExecuteResultTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
