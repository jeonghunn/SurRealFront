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
import { Router } from '@angular/router';
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
import { GroupService } from 'src/app/core/group.service';
import { IdentityService } from 'src/app/core/identity.service';
import { Util } from 'src/app/core/util';
import {
  AuthMessage,
  Chat,
  CommunicationResult,
  CommunicationType,
  Room,
} from 'src/app/model/type';
import { environment } from 'src/environments/environment';

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

  @Input()
  public groupId: number;

  public room: Room;

  public isConnected: boolean = false;
  public isAuthenticated: boolean = false;
  public reconnectDelay: number = 1000;

  public subscriptions: Subscription[] = [];

  public constructor(
    private identityService: IdentityService,
    private groupService: GroupService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router,
  ) {

    this.initSubscriptions();
  }

  public initSubscriptions(): void {
    this.subscriptions.push(
      this.groupService.openedRoom$.subscribe((room: Room) => {

        if (!room) {
          return;
        }

        this.room = room;
        this.initWebSocket();
      }),
    );
  }

  public initWebSocket(): void {

    this.webSocketSubject?.complete();
    this.webSocketSubject?.unsubscribe();

    this.webSocketSubject = webSocket({
      url: `${environment.socketServerUrl}${this.room?.id}`,
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

    this.subscriptions.push(
      this.webSocketSubject.pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(val => this.onConnectionError()),
            delayWhen(val => timer(this.reconnectDelay)),
          ),
        ),
      ).subscribe(
        (msg: any) => this.onMessageReceived(msg),
        (err) => this.onConnectionError(),
        () => console.log('complete'),
      ),
    );
  }

  public onMessageReceived(msg: any): void {

    switch (msg.T) {
      case CommunicationType.CHAT:
        const chat: Chat = new Chat(
          msg.id,
          msg.content,
          msg.createdAt,
          msg.user,
        );
        this.chats.push(chat);

        break;
      case CommunicationType.AUTH:
        const authResult: CommunicationResult = msg as CommunicationResult;
        this.onAuthResultReceived(authResult.result);

        break;
    }
  }

  public onAuthResultReceived(isSuccess: boolean): void {
    if (isSuccess) {
      this.isAuthenticated = true;
      return;
    }

    this.matSnackBar.open(
      this.translateService.instant('GROUP.ROOM.ERROR.AUTH'),
    );
    this.router.navigateByUrl('signin').then(null);
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
