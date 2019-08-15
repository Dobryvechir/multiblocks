import { TestBed } from '@angular/core/testing';

import { ChcIntegralService } from './chc-integral.service';

describe('ChcIntegralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChcIntegralService = TestBed.get(ChcIntegralService);
    expect(service).toBeTruthy();
  });
});
