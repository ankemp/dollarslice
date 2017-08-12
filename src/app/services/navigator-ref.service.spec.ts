import { TestBed, inject } from '@angular/core/testing';

import { NavigatorRefService } from './navigator-ref.service';

describe('NavigatorRefService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigatorRefService]
    });
  });

  it('should be created', inject([NavigatorRefService], (service: NavigatorRefService) => {
    expect(service).toBeTruthy();
  }));
});
