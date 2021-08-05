import { TestBed } from '@angular/core/testing';

import { StarterActivityService } from './starter-activity.service';

describe('StarterActivityService', () => {
  let service: StarterActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarterActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
