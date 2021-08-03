import { TestBed } from '@angular/core/testing';

import { MyStartersResolver } from './my-starters.resolver';

describe('MyStartersResolver', () => {
  let resolver: MyStartersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MyStartersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
