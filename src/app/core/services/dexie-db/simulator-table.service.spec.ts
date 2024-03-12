import { TestBed } from '@angular/core/testing';

import { SimulatorTableService } from './simulato-table.service';

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
