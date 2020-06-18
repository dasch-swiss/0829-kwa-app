import { TestBed } from '@angular/core/testing';

import { GravsearchServiceService } from './gravsearch-service.service';

describe('GravsearchServiceService', () => {
  let service: GravsearchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravsearchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
