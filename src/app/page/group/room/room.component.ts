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
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
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
  LiveMessage,
  Room,
} from 'src/app/model/type';
import { environment } from 'src/environments/environment';
import { RoomService } from 'src/app/core/room.service';
import { ChatComponent } from '../chat/chat.component';
import { LayoutService } from 'src/app/core/layout.service';

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
  public isChatDisabled: boolean = false;
  public isChatLoading: boolean = false;
  public isChatFullyLoad: boolean = false;
  public reconnectDelay: number = 1000;
  public offset: number = 0;
  public isShortWidth: boolean = false;

  public readonly DEFAULT_CHAT_MARGIN: number = 64;
  public readonly FILE_ATTACH_HEIGHT: number = 88;

  public chatStyle: any = {
    height: null,
  };

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
    private roomService: RoomService,
    private layoutService: LayoutService,
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
      this.roomService.uploadFiles$.subscribe((files: File[]) => {
        this.initChatHeight(files?.length > 0);
      }),
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
    );

  }

  public resetRoom(): void {
    this.chatQueue$?.unsubscribe();
    this.dateCriteria = new Date();
    this.isChatFullyLoad = false;
    this.isChatDisabled = false;
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
      deserializer: message => this.dataService.deserializeSocketMessage(message),
      serializer: message => this.dataService.serializeSocketMessage(message),
      openObserver: {
        next: value => {
          this.isConnected = true;
          this.isChatDisabled = false;
          this.reconnectDelay = 1000;
          this.sendAuthMessage();
        },
        error: value => {
          this.onConnectionError(value);
        },
      },
    });

    this.subscriptions.push(
      this.webSocketSubject.pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(val => this.onConnectionError(val)),
            delayWhen(val => timer(this.reconnectDelay)),
          ),
        ),
      ).subscribe(
        (msg: any) => this.onMessageReceived(msg),
        (err) => this.onConnectionError(err),
        () => this.onConnectionComplete(),
      ),
    );
  }

  public onConnectionComplete(): void {
    console.log('complete');
    this.isChatDisabled = true;
    this.changeDetectorRef.markForCheck();
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
        this.changeDetectorRef.markForCheck();
        
        break;
      case CommunicationType.AUTH:
        const authResult: CommunicationResult = msg as CommunicationResult;
        this.onAuthResultReceived(authResult.result);
      case CommunicationType.LIVE:
        const liveMessage: LiveMessage = (msg as LiveMessage);

        new Response(liveMessage?.content).arrayBuffer()
          .then((result: ArrayBuffer) => {
            const data = new Float32Array(result);
            this.roomService.setLiveRoomContent(
              [
                {
                  x: data[0],
                  y: data[2],
                },
              ],
            );
          });

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

  public onConnectionError(error: any = null): void {
    console.log('ConnectionError', error);
    this.isConnected = false;
    this.reconnectDelay = this.reconnectDelay * 1.5;

    if(this.reconnectDelay < 3000) {
      return;
    }

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

  public initChatHeight(isExpand: boolean = false): void {
    let margin: number = this.DEFAULT_CHAT_MARGIN;


    if (isExpand) {
      margin += this.FILE_ATTACH_HEIGHT;
    }

    this.chatStyle.height = `calc(100% - ${margin}px)`;
    this.changeDetectorRef.markForCheck();
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
    this.webSocketSubject?.unsubscribe();
    Util.unsubscribe(...this.subscriptions);
  }

}
