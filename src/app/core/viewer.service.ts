import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attach } from 'src/app/model/type';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  public attaches$: BehaviorSubject<Attach[]> = new BehaviorSubject<Attach[]>(undefined);
  public index$: BehaviorSubject<number> = new BehaviorSubject<number>(undefined);
  public chatId$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  constructor() { }

  public open(
    attaches: any,
    index: number,
    chatId: string = null,
  ): void {
    history.pushState(null, null, location.href);
    this.attaches$.next(attaches);
    this.index$.next(index);
    this.chatId$.next(chatId);
  }

  public close(): void {
    this.attaches$.next(undefined);
    this.index$.next(undefined);
  }

  public setIndex(value: number): void {
    this.index$.next(value);
  }



}
