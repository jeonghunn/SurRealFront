import {
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { TextOnlySnackBar } from '@angular/material/snack-bar/simple-snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  Subscription,
  timer,
} from 'rxjs';
import {
  delayWhen,
  retryWhen,
  take,
  tap,
} from 'rxjs/operators';
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
import { Util } from 'src/app/core/util';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: [ './room.component.scss' ],
})
export class RoomComponent implements OnDestroy {

  public webSocketSubject: WebSocketSubject<any> = null;
  public chats: Chat[] = [];

  @Input()
  public isChatViewOpen: boolean;

  @Input()
  public isLiveViewOpen: boolean;

  public isConnected: boolean = false;
  public reconnectDelay: number = 1000;

  public subscriptions: Subscription[] = [];

  public constructor(
    private identityService: IdentityService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) {

    this.webSocketSubject = webSocket({
      url: environment.socketServerUrl,
      openObserver: {
        next: value => {
          this.isConnected = true;
          this.reconnectDelay = 1000;
          this.sendAuthMessage();
        },
        error: value => {
          this.onConnectionError();
        },
      },
    });

    this.initSubscriptions();

  }

  public initSubscriptions(): void {
    this.subscriptions.push(
      this.webSocketSubject.pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(val => this.onConnectionError()),
            delayWhen(val => timer(this.reconnectDelay)),
          ),
        ),
      ).subscribe(
        (msg) => {
          const chat: Chat = new Chat(
            msg.id,
            msg.content,
            msg.createdAt,
            msg.user,
          );
          this.chats.push(chat);
        },
        (err) => this.onConnectionError(),
        () => console.log('complete'),
      ),
    );
  }

  public onConnectionError(): void {
    this.isConnected = false;
    this.reconnectDelay = this.reconnectDelay * 1.5;
    const snackBarRef: MatSnackBarRef<TextOnlySnackBar> = this.matSnackBar.open(
      this.translateService.instant('GROUP.ROOM.ERROR.CONNECTION.DESC'),
      this.translateService.instant('GROUP.ROOM.ERROR.CONNECTION.RETRY'),
      { duration: this.reconnectDelay },
    );

    snackBarRef.onAction().pipe(take(1)).subscribe(() => {
      Util.unsubscribe(...this.subscriptions);
      this.initSubscriptions();
    });

  }

  public sendAuthMessage(): void {
    const auth: AuthMessage = new AuthMessage(this.identityService.auth);
    this.webSocketSubject.next(auth);
  }

  public sendMessage(chat: Chat): void {
    this.webSocketSubject.next(chat);
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

}
