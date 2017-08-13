import { Injectable, Inject } from '@angular/core';

import { TesseractJsRefService } from './tesseractjs-ref.service';


@Injectable()
export class TesseractJsService {
  _tesseract: any;

  constructor(
    tesseractRef: TesseractJsRefService
  ) {
    this._tesseract = tesseractRef.tesseract;
    console.log(this._tesseract);
  }

}
