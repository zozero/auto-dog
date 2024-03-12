import { TestBed } from '@angular/core/testing';

import { DexieDBService } from './dexie-db.service';

describe('DexieDBService', () => {
  let service: DexieDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexieDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
