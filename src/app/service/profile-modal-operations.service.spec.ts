import { TestBed } from '@angular/core/testing';

import { ProfileModalOperationsService } from './profile-modal-operations.service';

describe('ProfileModalOperationService', () => {
  let service: ProfileModalOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileModalOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
