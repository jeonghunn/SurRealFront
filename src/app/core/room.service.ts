import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  public webSocketSubject: WebSocketSubject<any> = null;

  public constructor() { }
}
