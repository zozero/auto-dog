import { TestBed } from '@angular/core/testing';

import { TipsDialogService } from './tips-dialog.service';

describe('TipsDialogService', () => {
  let service: TipsDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipsDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
