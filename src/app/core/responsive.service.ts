import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  Subject,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {

  public _windowResize$: Observable<Event> = fromEvent(window, 'resize');
  public windowResize$: BehaviorSubject<Window> = new BehaviorSubject<Window>(window);
  public windowSize$: Subject<number> = new Subject<number>();
  private _isShortWidth: boolean;

  public constructor() {
    this.onResize(window);
    this._windowResize$.subscribe((event) => {
      this.onResize(event.target as Window);
      this.windowResize$.next(event.target as Window);
    });
  }

  public isShortWidth(): boolean {
    return this._isShortWidth;
  }

  public onResize(target: Window): void {
    this._isShortWidth = window.innerWidth <= 700;
    this.windowSize$.next(target.innerWidth);
  }
}
