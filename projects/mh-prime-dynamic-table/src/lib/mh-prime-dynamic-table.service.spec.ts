import { TestBed } from '@angular/core/testing';

import { MhPrimeDynamicTableService } from './mh-prime-dynamic-table.service';

describe('MhPrimeDynamicTableService', () => {
  let service: MhPrimeDynamicTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MhPrimeDynamicTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
