import { TestBed } from '@angular/core/testing';

import { SimulatorTableService } from './simulator-table.service';

describe('SimulatorInfoTableService', () => {
  let service: SimulatorTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatorTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
