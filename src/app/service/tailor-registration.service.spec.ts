import { TestBed } from '@angular/core/testing';

import { TailorRegistrationService } from './tailor-registration.service';

describe('TailorRegistrationService', () => {
  let service: TailorRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailorRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
