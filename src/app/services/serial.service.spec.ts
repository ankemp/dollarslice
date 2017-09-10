import { TestBed, inject } from '@angular/core/testing';

import { SerialService } from './serial.service';

describe('SerialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerialService]
    });
  });

  it('should be created', inject([SerialService], (service: SerialService) => {
    expect(service).toBeTruthy();
  }));
});
