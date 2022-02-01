import {
  Component,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  webSocket,
  WebSocketSubject,
} from 'rxjs/webSocket';
import { Chat } from 'src/app/model/type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: [ './room.component.scss' ],
})
export class RoomComponent {

  public webSocketSubject: WebSocketSubject<any> = null;
  public chats: Chat[] = [];

  @Input()
  public isChatViewOpen: boolean;

  @Input()
  public isLiveViewOpen: boolean;

  public subscriptions: Subscription[] = [];

  public constructor() {

    this.webSocketSubject = webSocket({
      url: environment.socketServerUrl,
    });

    this.subscriptions = [
      this.webSocketSubject.subscribe(
        (msg) => {
          console.log( msg);
          this.chats.push(msg as Chat);
        },
        err => console.log(err),
        () => console.log('complete'),
      ),
    ];

  }

  public sendMessage(chat: Chat): void {
    this.webSocketSubject.next(chat);
  }

}
