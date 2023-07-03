import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  Subject,
} from 'rxjs';
import { WindowSizeWidth } from 'src/app/model/type';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  public _windowResize$: Observable<Event> = fromEvent(window, 'resize');
  public windowResize$: BehaviorSubject<Window> = new BehaviorSubject<Window>(window);
  public windowSize$: Subject<number> = new Subject<number>();
  public isSideNavOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isShortWidth: boolean;
  private _isSideNavOpen: boolean;

  public constructor() {
    this.onResize(window);
    this._windowResize$.subscribe((event) => {
      this.onResize(event.target as Window);
      this.windowResize$.next(event.target as Window);
    });
    this.isSideNavOpen$.subscribe((isOpen: boolean) => {
      this._isSideNavOpen = isOpen;
    });
  }

  public get isSideNavOpen(): boolean {
    return this._isSideNavOpen;
  }

  public set isSideNavOpen(isOpen: boolean) {
    this.isSideNavOpen$.next(isOpen);
  }

  public isShortWidth(): boolean {
    return this._isShortWidth;
  }

  public onResize(target: Window): void {
    this._isShortWidth = window.innerWidth <= WindowSizeWidth.MOBILE;
    this.windowSize$.next(target.innerWidth);
  }
}
