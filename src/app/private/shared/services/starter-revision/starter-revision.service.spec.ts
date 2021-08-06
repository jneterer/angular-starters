import { TestBed } from '@angular/core/testing';

import { StarterRevisionService } from './starter-revision.service';

describe('StarterRevisionService', () => {
  let service: StarterRevisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarterRevisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
