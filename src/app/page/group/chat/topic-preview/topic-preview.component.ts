import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  take,
} from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { GroupService } from 'src/app/core/group.service';
import { IdentityService } from 'src/app/core/identity.service';
import { NetworkService } from 'src/app/core/network.service';
import { RoomService } from 'src/app/core/room.service';
import { Util } from 'src/app/core/util';
import {
  Chat,
  Room,
} from 'src/app/model/type';

@Component({
  selector: 'app-topic-preview',
  templateUrl: './topic-preview.component.html',
  styleUrls: ['./topic-preview.component.scss']
})
export class TopicPreviewComponent implements OnInit, OnDestroy {

  @Input()
  public chats: Chat[] = [];

  @Input()
  public topicId: number;

  @Input()
  public title: string;

  public room: Room;

  public subscriptions: Subscription[] = [];
  public isConnected: boolean = false;
  public isChatLoading: boolean = true;
  public isChatFullyLoad: boolean = false;
  public offset: number = 0;
  public dateCriteria: Date;
  public reconnectDelay: number = 1000;
  public connectCount: number = 0;
  public isAuthenticated: boolean = false;
  public reAuthDelay: number = 1000;
  public chatQueue$: Subject<{ offset: number, isFuture: boolean }> = new Subject();
  public cancelDelay$: Subject<any> = new Subject();

  private readonly CHAT_FETCH_COUNT: number = 5;

  public constructor(
    private networkService: NetworkService,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private groupService: GroupService,
    private roomService: RoomService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.groupService.openedRoom$.subscribe((room: Room) => {

        if (!room || this.room?.id === room?.id) {
          return;
        }

        this.room = room;

        this.fetchChats(0, false, this.topicId).pipe(take(1)).subscribe((result: any) => {
          this.updateChats(result,false);
        });
      }),
      this.roomService.lastOtherChat$.subscribe((chat: Chat) => {
        if (!chat || chat?.topic_id !== this.topicId) {
          return;
        }

        this.chats = [ ...this.chats, chat ].slice(-5);
        this.changeDetectorRef.markForCheck();
      }),
    );

  }

  public reInit(): void {
    //this.initWebSocket();
    
  }

  public updateChats(result: any, isReverse: boolean): void {
    this.chats = isReverse ? [ ...result.chats, ...this.chats ] : [ ...this.chats, ...result.chats ];
    this.changeDetectorRef.markForCheck();
  }


  public initChatLists(): void {
    this.chats = [];
  }

  public goToTopic(id: number): void {
    let url: string = `/group/${this.room?.group_id}/room/${this.room?.id}`;

    if (id) {
      url += `/topic/${id}`;
    }

    this.router.navigateByUrl(url).then(null);
  }


  public fetchChats(
    offset: number,
    isFuture: boolean,
    topicId: number = null,
    ): Observable<{
    isFuture: Boolean,
    chats: Chat[],
  }> {

    return this.dataService.getChats(
      this.room?.group_id,
      this.room?.id,
      topicId,
      new Date(),
      offset,
      isFuture,
      this.CHAT_FETCH_COUNT,
    );
  }


  public pushChat(chat: Chat): void {
    this.chats.push(chat);
    this.chats = this.chats?.slice(-5);
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

}
