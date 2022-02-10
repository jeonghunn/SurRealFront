import {
  Component,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  webSocket,
  WebSocketSubject,
} from 'rxjs/webSocket';
import { IdentityService } from 'src/app/core/identity.service';
import {
  AuthMessage,
  Chat,
} from 'src/app/model/type';
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

  public constructor(
    private identityService: IdentityService,
  ) {

    this.webSocketSubject = webSocket({
      url: environment.socketServerUrl,
      openObserver: {
        next: value => {
          console.log(value);
          this.sendAuthMessage();
        },
      },
    });

    this.subscriptions = [
      this.webSocketSubject.subscribe(
        (msg) => {
          const chat: Chat = new Chat(
            msg.id,
            msg.content,
            msg.createdAt,
            msg.user,
          );
          this.chats.push(chat);
        },
        err => console.log(err),
        () => console.log('complete'),
      ),
    ];

  }

  public sendAuthMessage(): void {
    const auth: AuthMessage = new AuthMessage(this.identityService.auth);
    this.webSocketSubject.next(auth);
  }

  public sendMessage(chat: Chat): void {
    this.webSocketSubject.next(chat);
  }

}
