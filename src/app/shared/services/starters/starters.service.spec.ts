import { TestBed } from '@angular/core/testing';

import { StartersService } from './starters.service';

describe('StartersService', () => {
  let service: StartersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
