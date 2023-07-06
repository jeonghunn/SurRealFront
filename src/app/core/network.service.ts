import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public isConnected: boolean = true;
  public isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { 
  }


  public setConnectionStatus(): void {
    if (window.navigator.onLine !== this.isConnected) {
      console.log('Connection status changed to ' + window.navigator.onLine);
      this.isConnected = !this.isConnected;
      this.isConnected$.next(this.isConnected);
    }
  }

  public startService(): void {
    this.setConnectionStatus();
    timer(0, 2000).subscribe(() => {
      this.setConnectionStatus();
    });
  }



    
}
