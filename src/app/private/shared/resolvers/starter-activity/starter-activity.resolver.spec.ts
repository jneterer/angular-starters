import { TestBed } from '@angular/core/testing';

import { StarterActivityResolver } from './starter-activity.resolver';

describe('StarterActivityResolver', () => {
  let resolver: StarterActivityResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StarterActivityResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
