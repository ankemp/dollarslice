import { TestBed, inject } from '@angular/core/testing';

import { TesseractJsRefService } from './tesseractjs-ref.service';

describe('TesseractJsRefService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TesseractJsRefService]
    });
  });

  it('should be created', inject([TesseractJsRefService], (service: TesseractJsRefService) => {
    expect(service).toBeTruthy();
  }));
});
