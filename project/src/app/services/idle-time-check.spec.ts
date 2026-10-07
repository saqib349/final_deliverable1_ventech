import { TestBed } from '@angular/core/testing';

import { IdleTimeCheck } from './idle-time-check';

describe('IdleTimeCheck', () => {
  let service: IdleTimeCheck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleTimeCheck);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
