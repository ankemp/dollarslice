import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TesseractJob, TesseractStatic } from 'tesseract.js';

import { TesseractJsRefService } from './tesseractjs-ref.service';

@Injectable()
export class TesseractJsService {
  private _tesseract: TesseractStatic;
  private job: TesseractJob;
  progress: Observable<number>;

  constructor(
    tesseractRef: TesseractJsRefService
  ) {
    this._tesseract = tesseractRef.tesseract;
    console.log(this._tesseract);
  }

  startJob(blob: Blob): Promise<null> {
    return new Promise((Resolve, Reject) => {
      this.job = this._tesseract.recognize(blob);
      this.progress = new Observable(observer => {
        Resolve();
        this.job.progress(progress => {
          console.log(progress);
          observer.next(progress.progress);
        });
        this.job.then(result => {
          observer.complete();
          console.log('Done:', result);
        });
      });
    });
  }

}
