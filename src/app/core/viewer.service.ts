import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attach } from 'src/app/model/type';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  public attaches$: BehaviorSubject<Attach[]> = new BehaviorSubject<Attach[]>(undefined);
  public index$: BehaviorSubject<number> = new BehaviorSubject<number>(undefined);

  constructor() { }

  public open(attaches: any, index: number): void {
    history.pushState(null, null, location.href);
    this.attaches$.next(attaches);
    this.index$.next(index);
  }

  public close(): void {
    this.attaches$.next(undefined);
    this.index$.next(undefined);
  }

  public setIndex(value: number): void {
    this.index$.next(value);
  }



}
