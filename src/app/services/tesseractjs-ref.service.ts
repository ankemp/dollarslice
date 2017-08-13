import { Injectable } from '@angular/core';

import * as Tesseract from 'tesseract.js';

function getTesseract(): any {
  return Tesseract;
}

@Injectable()
export class TesseractJsRefService {

  get tesseract(): any {
    return getTesseract();
  }

}
