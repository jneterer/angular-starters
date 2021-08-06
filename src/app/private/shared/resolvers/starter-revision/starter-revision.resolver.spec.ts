import { TestBed } from '@angular/core/testing';

import { StarterRevisionResolver } from './starter-revision.resolver';

describe('StarterRevisionResolver', () => {
  let resolver: StarterRevisionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StarterRevisionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
