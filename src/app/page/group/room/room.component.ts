import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  Subject,
  Subscription,
  of,
  timer,
} from 'rxjs';
import {
  concatMap,
  delayWhen,
  repeat,
  retryWhen,
  take,
  takeUntil,
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
  FileContainer,
  LiveMessage,
  Room,
  Topic,
} from 'src/app/model/type';
import { environment } from 'src/environments/environment';
import { RoomService } from 'src/app/core/room.service';
import { ChatComponent } from '../chat/chat.component';
import { LayoutService } from 'src/app/core/layout.service';
import { NetworkService } from 'src/app/core/network.service';

@Component({
  selector: 'app-room',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './room.component.html',
  styleUrls: [ './room.component.scss' ],
})
export class RoomComponent implements OnDestroy, OnChanges {

  public webSocketSubject: WebSocketSubject<any> = null;
  public chats: Chat[] = null;
  public extraChats: Chat[] = null;
  public recentExtraChats: Chat[] = null;
  public dateCriteria: Date;
  public futureDateCriteria: Date;
  public chatQueue$: Subject<{ offset: number, isFuture: boolean }> = new Subject();
  public cancelDelay$: Subject<any> = new Subject();

  @Input()
  public isChatViewOpen: boolean;

  @Input()
  public isLiveViewOpen: boolean;

  @Input()
  public isInfoViewOpen: boolean;

  @Input()
  public groupId: number;

  public room: Room;
  public topic: Topic;

  public isConnected: boolean = false;
  public connectCount: number = 0;
  public isAuthenticated: boolean = false;
  public isChatDisabled: boolean = false;
  public isChatLoading: boolean = false;
  public isChatFullyLoad: boolean = false;
  public reconnectDelay: number = 1000;
  public reAuthDelay: number = 100;
  public offset: number = 0;
  public futureOffset: number = 0;
  public isShortWidth: boolean = false;
  public topicId: number = null;

  public readonly DEFAULT_CHAT_MARGIN: number = 72;
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
    private networkService: NetworkService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.init();
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.isConnected) {
      this.reInit();
    }
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
      this.roomService.uploadFiles$.subscribe((files: FileContainer[]) => {
        this.initChatHeight(files?.length > 0);
      }),
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
      this.activatedRoute.params.subscribe((params: Params) => {
        this.topicId = params?.topic_id ? parseInt(params.topic_id) :  null;

        if (this.topicId) {
          this.dataService.getTopic(
            params?.id,
            params?.room_id,
            this.topicId,
            ).pipe(take(1)).subscribe((topic: Topic) => {

            if (this.topic && this.topicId !== this.topic?.id) {
              this.resetRoom();
              this.initRoom(this.room);
            }

            this.topic = topic;
          });
        }


      }),
      this.networkService.isConnected$.subscribe((isConnected: boolean) => {

        if (!isConnected) {
          this.webSocketSubject?.complete();
          this.webSocketSubject?.unsubscribe();
        } else {
          this.initWebSocket();
        }
      }),
    );

  }

  public resetRoom(): void {
    this.chatQueue$?.unsubscribe();
    this.dateCriteria = new Date();
    this.futureDateCriteria = new Date();
    this.isChatFullyLoad = false;
    this.isChatDisabled = false;
    this.chats = null;
    this.extraChats = null;
    this.recentExtraChats = null;
    this.offset = 0;
    this.changeDetectorRef.markForCheck();
  }

  public partition(array: any[], filter: any) {
    let pass = [], fail = [];
    array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
  }

  public updateChats(result: any, isReverse: boolean): void {
    const [currentChats, otherChats] = this.partition(result?.chats, (chat) => chat.topic_id === this.topicId);

    console.log('update chats', currentChats, otherChats);

    if (!isReverse) {
      this.chats = [ ...this.chats, ...currentChats ];
      this.extraChats = [ ...this.extraChats, ...otherChats ];
    } else {
      this.chats = [ ...currentChats, ...this.chats ];
      this.extraChats = [ ...otherChats, ...this.extraChats ];
    }

    this.recentExtraChats = this.extraChats.slice(-3);
    this.changeDetectorRef.markForCheck();
  }



  public initRoom(room: Room): void {
    this.room = room;

    this.chatQueue$ = new Subject<{ offset: number, isFuture: boolean }>();

    this.subscriptions.push(
      this.chatQueue$.pipe(
        concatMap(i => this.fetchChats(i.offset, i.isFuture, this.topicId)),
      ).subscribe((result: { isFuture: boolean, chats: Chat[] }) => {
          this.isChatLoading = false;
          console.log('init', result, this.offset);
          if (result?.isFuture) {
            this.updateChats(result, false);

            if (result?.chats?.length > 0) {
              this.fetchFutureChats();
            } else {
              this.resetFutureCriteria();
              this.sendAuthMessage();
            }
          } else {
            this.updateChats(result, true);
            this.isChatFullyLoad = result?.chats?.length === 0;
          }

          
          this.changeDetectorRef.markForCheck();
        }),
    );

    this.initWebSocket();
    this.initChatLists();

    this.chatQueue$.next({
      offset: this.offset,
      isFuture: false,
    });
  }

  public initChatLists(): void {
    this.chats = [];
    this.extraChats = [];
    this.recentExtraChats = [];
  }

  public initWebSocket(): void {

    this.webSocketSubject?.complete();
    this.webSocketSubject?.unsubscribe();

    this.webSocketSubject = webSocket({
      url: `${environment.socketServerUrl}${this.room?.id}`,
      deserializer: (message) => {
        this.resetFutureCriteria();
        return this.dataService.deserializeSocketMessage(message);
      },
      serializer: message => this.dataService.serializeSocketMessage(message),
      openObserver: {
        next: value => {
          if (!this.isConnected && this.offset > 0 && this.connectCount > 0) {
            console.log('its about time to load future chats');
            this.fetchFutureChats();
          } else {
            this.sendAuthMessage();
          }

          this.isConnected = true;
          this.isChatDisabled = false;
          this.connectCount++;
          this.reconnectDelay = 1000;
          this.changeDetectorRef.markForCheck();
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
            takeUntil(this.cancelDelay$),
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

    if (!this.isConnected) {
      this.reInit();
    }
  }

  public resetFutureCriteria(): void {
    this.futureDateCriteria = new Date();
    this.futureOffset = 0;
  }

  public onWindowResize(): void {
    this.initChatHeight(false);
  }

  public onMessageReceived(msg: any): void {

    console.log('message receiv', msg) ;

    switch (msg.T) {
      case CommunicationType.CHAT:
        const chat: Chat = new Chat(
          msg.id,
          msg.category,
          msg.content,
          msg.createdAt,
          msg.user,
          msg.topic_id,
          msg.meta,
        );

        this.pushChat(chat, msg.topic_id);
        
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

    setTimeout(() => {
      console.log('[Auth] Retry to send auth message.');
      this.sendAuthMessage();
      this.reAuthDelay = this.reAuthDelay * 2;
    }, this.reAuthDelay);
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
      this.cancelDelay$.next(null);
    });

  }

  public reInit(): void {
    this.initWebSocket();
    
  }

  public pushChat(chat: Chat, topicId: number): void {

    if (topicId !== this.topicId) {
      this.roomService.pushOtherChat(chat);
      this.extraChats.push(chat);
      this.recentExtraChats = this.extraChats?.slice(-3);
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.chats.push(chat);
    this.changeDetectorRef.markForCheck();
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
    this.chatQueue$.next({
      offset: this.offset,
      isFuture: false,
    });
  }

  public fetchFutureChats(): void {
    this.chatQueue$.next({
      offset: this.futureOffset,
      isFuture: true,
    });
    this.futureOffset += this.CHAT_FETCH_COUNT;
  }

  public fetchChats(
    offset: number,
    isFuture: boolean,
    topicId: number = null,
    ): Observable<{
    isFuture: Boolean,
    chats: Chat[],
  }> {

    if(!isFuture && this.isChatFullyLoad) {
      return of({
        isFuture: false,
        chats: [],
      });
    }


    return this.dataService.getChats(
      this.room?.group_id,
      this.room?.id,
      topicId,
      isFuture ? this.futureDateCriteria : this.dateCriteria,
      offset,
      isFuture,
      this.CHAT_FETCH_COUNT,
    ).pipe(
      take(1),
      retryWhen(errors =>
        errors.pipe(
          repeat({ delay: 500 }),
          tap(val => this.onConnectionError(val)),
          delayWhen(val => timer(this.reconnectDelay)),
        ),
      ),
      );
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
