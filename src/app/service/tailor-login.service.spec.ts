import { TestBed } from '@angular/core/testing';

import { TailorLoginService } from './tailor-login.service';

describe('TailorLoginServiceService', () => {
  let service: TailorLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailorLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
