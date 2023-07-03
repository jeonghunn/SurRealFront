import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attach } from 'src/app/model/type';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  public attach$: BehaviorSubject<Attach> = new BehaviorSubject<Attach>(undefined);

  constructor() { }

  public open(attach: any): void {
    this.attach$.next(attach);
  }

  public close(): void {
    this.attach$.next(undefined);
  }



}
