import { TestBed } from '@angular/core/testing';

import { AiHttpService } from './ai-http.service';

describe('AiHttpService', () => {
  let service: AiHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
