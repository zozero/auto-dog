import { TestBed } from '@angular/core/testing';

import { CheckConfigService } from './check-config.service';

describe('CheckConfigService', () => {
  let service: CheckConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
