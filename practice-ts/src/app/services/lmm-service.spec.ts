import { TestBed } from '@angular/core/testing';
import { LmmService } from './lmm-service';

describe('LmmService', () => {
  let service: LmmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
