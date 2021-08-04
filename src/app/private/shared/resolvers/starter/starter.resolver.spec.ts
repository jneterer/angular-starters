import { TestBed } from '@angular/core/testing';

import { StarterResolver } from './starter.resolver';

describe('StarterResolver', () => {
  let resolver: StarterResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StarterResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
