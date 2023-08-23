import { TestBed } from '@angular/core/testing';

import { PushMessageService } from './push-message.service';

describe('PushMessageService', () => {
  let service: PushMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
