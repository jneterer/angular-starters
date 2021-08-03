import { TestBed } from '@angular/core/testing';

import { PrivateGuard } from './private.guard';

describe('PrivateGuard', () => {
  let guard: PrivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PrivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
