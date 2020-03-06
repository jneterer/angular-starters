import { TestBed } from '@angular/core/testing';

import { ContentResolverService } from './content-resolver.service';

describe('ContentResolverService', () => {
  let service: ContentResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
