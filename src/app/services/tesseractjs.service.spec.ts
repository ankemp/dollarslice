import { TestBed, inject } from '@angular/core/testing';

import { TesseractJsService } from './tesseractjs.service';

describe('TesseractjsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TesseractJsService]
    });
  });

  it('should be created', inject([TesseractJsService], (service: TesseractJsService) => {
    expect(service).toBeTruthy();
  }));
});
