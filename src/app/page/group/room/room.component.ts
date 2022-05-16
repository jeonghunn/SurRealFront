import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { TextOnlySnackBar } from '@angular/material/snack-bar/simple-snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import {
  concatMap,
  delayWhen,
  retryWhen,
  take,
  tap,
} from 'rxjs/operators';
import {
  webSocket,
  WebSocketSubject,
} from 'rxjs/webSocket';
import { DataService } from 'src/app/core/data.service';
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
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-room',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './room.component.html',
  styleUrls: [ './room.component.scss' ],
})
export class RoomComponent implements OnDestroy {

  public webSocketSubject: WebSocketSubject<any> = null;
  public chats: Chat[] = null;
  public dateCriteria: Date;
  public chatQueue$: Subject<number> = new Subject();

  @Input()
  public isChatViewOpen: boolean;

  @Input()
  public isLiveViewOpen: boolean;

  @Input()
  public isInfoViewOpen: boolean;

  @Input()
  public groupId: number;

  public room: Room;

  public isConnected: boolean = false;
  public isAuthenticated: boolean = false;
  public isChatLoading: boolean = false;
  public isChatFullyLoad: boolean = false;
  public reconnectDelay: number = 1000;
  public offset: number = 0;

  public subscriptions: Subscription[] = [];

  private readonly CHAT_FETCH_COUNT: number = 30;

  @ViewChild('chatComponent')
  private chatComponent: ChatComponent;

  public constructor(
    private dataService: DataService,
    private identityService: IdentityService,
    private groupService: GroupService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {
    this.init();
  }

  public init(): void {
    this.subscriptions.push(
      this.groupService.openedRoom$.subscribe((room: Room) => {

        if (!room || this.room?.id === room?.id) {
          return;
        }

        this.resetRoom();
        this.initRoom(room);
      }),
    );

  }

  public resetRoom(): void {
    this.chatQueue$?.unsubscribe();
    this.dateCriteria = new Date();
    this.isChatFullyLoad = false;
    this.chats = null;
    this.offset = 0;
  }

  public initRoom(room: Room): void {
    this.room = room;

    this.chatQueue$ = new Subject<number>();

    this.subscriptions.push(
      this.chatQueue$.pipe(
        concatMap(i => this.fetchChats(i)),
      )
        .subscribe((chats: Chat[]) => {
          this.isChatLoading = false;
          this.chats = [ ...chats, ...this.chats ];

          this.isChatFullyLoad = chats?.length === 0;
          this.changeDetectorRef.markForCheck();
        }),
    );

    this.initWebSocket();
    this.chats = [];
    this.chatQueue$.next(this.offset);
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
      this.init();
    });

  }

  public fetchPreviousChats(): void {
    this.isChatLoading = true;
    this.offset += this.CHAT_FETCH_COUNT;
    this.chatQueue$.next(this.offset);
  }

  public fetchChats(offset: number): Observable<any> {
    return this.dataService.getChats(
      this.room?.group_id,
      this.room?.id,
      this.dateCriteria,
      offset,
      this.CHAT_FETCH_COUNT,
    ).pipe(take(1));
  }

  public sendAuthMessage(): void {
    const auth: AuthMessage = new AuthMessage(this.identityService.auth);
    this.webSocketSubject.next(auth);
  }

  public sendMessage(chat: Chat): void {
    this.webSocketSubject.next(chat);
  }

  public ngOnDestroy(): void {
    this.groupService.openedRoom$.next(null);
    this.webSocketSubject?.unsubscribe();
    Util.unsubscribe(...this.subscriptions);
  }

}
