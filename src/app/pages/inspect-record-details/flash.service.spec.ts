import { TestBed } from '@angular/core/testing';

import { FlashService } from './flash.service';

describe('FlashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlashService = TestBed.get(FlashService);
    expect(service).toBeTruthy();
  });
});
