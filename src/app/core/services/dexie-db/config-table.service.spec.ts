import { TestBed } from '@angular/core/testing';

import { ConfigTableService } from './config-table.service';

describe('ConfigTableService', () => {
  let service: ConfigTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
