import { TestBed } from '@angular/core/testing';

import { TableHttpService } from './table-http.service';

describe('ExecutionSideHttpService', () => {
  let service: TableHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
