import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  catchError,
  delayWhen,
  retryWhen,
  take,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import { RoomService } from 'src/app/core/room.service';
import {
  Chat,
  CommunicationResult,
  CommunicationType,
  LiveMessage,
  SpaceAction,
  SpaceActionType,
  SpaceItem,
} from 'src/app/model/type';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy, OnChanges {

  public isEditMode: boolean = true;

  @Input()
  public groupId: number = null;

  @Input()
  public roomId: number = null;

  @Input()
  public spaceKey: string = null;

  public title: string = null;
  public content: string = null;
  public data: SpaceItem[] = [];
  public space: any = null;
  public isConnected: boolean = false;
  public reconnectDelay: number = 5000;
  public isAuthenticated: boolean = false;
  public reAuthDelay: number = 100;
  public isAllowEdit: boolean = false;

  public subscriptions: any = [];
  public updateTimerSubscription: any = null;

  @ViewChild('contentElement')
  public contentElement: ElementRef;

  @ViewChild('titleElement')
  public titleElement: ElementRef;


  public constructor(
    private dataService: DataService,
    private roomService: RoomService,
    private changeDetectorRef: ChangeDetectorRef,
    private identityService: IdentityService,
  ) { }

  public ngOnInit(): void {
    this.load();
    this.roomService.initSpaceWebSocket(this.roomId, this.spaceKey);
    this.subscriptions = [
      this.roomService.spaceWebSocketSubject$.pipe(
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
      this.roomService.clipboardChat$.subscribe((chat: Chat) => {
        if(!chat) {
          return;
        }

        console.log('clipboardChat', chat);
        this.appendText('\n' + chat.content);
      }),
    ];
  }

  public ngOnChanges(changes: any): void {
    console.log('changes', changes);
  }

  public appendText(text: string): void {
    this.contentElement.nativeElement.innerText += text;
    this.changeDetectorRef.markForCheck();
    this.onContentChanged(null);
  }

  public onContentChanged(event: any): void {
    this.title = this.titleElement.nativeElement.innerText;
    this.content = this.contentElement.nativeElement.innerText;
    this.updateLazy();
  }

  public send(actionType: SpaceActionType, item: SpaceItem): void {
    const spaceAction: SpaceAction = new SpaceAction();
    spaceAction.type = actionType;
    spaceAction.content = item;

    const liveMessage: LiveMessage = new LiveMessage({
      type: 0,
      content: spaceAction,
    });
    liveMessage.T = CommunicationType.LIVE;


    this.roomService.spaceWebSocketSubject$.next(liveMessage);

  }


  public onConnectionComplete(): void {
    console.log('docuent socket complete');
    this.isAllowEdit = true;
    this.changeDetectorRef.markForCheck();

    if (!this.isConnected) {
      this.load();
    }
  }

  public ngOnDestroy(): void {
    this.roomService.closeSpaceWebSocket();
  }

  public onConnectionError(error: any = null): void {
    console.log('ConnectionError', error);
    this.isConnected = false;

  }

  public onMessageReceived(msg: any): void {

    switch (msg.T) {
      case CommunicationType.AUTH:
        const authResult: CommunicationResult = msg as CommunicationResult;
        this.roomService.onAuthResultReceived(authResult.result);
      case CommunicationType.LIVE:
        const version: number = parseInt(msg.content || 0);
        
        if (version <= this.space?.version) {
          return;
        }

        this.load();

        break;
    }
  }

  public update(): void {
    
    this.dataService.updateSpace(
      this.space?.key,
      this.groupId,
      this.roomId,
      this.title,
      this.content,
      this.space?.version,
      ).pipe(
        take(1),
        catchError((err) => {
         if (err?.status === 406) {
          this.load();
        }
        return throwError(err);
      }),
      ).subscribe((space) => {
      this.space = space;
      });
    }

    

  public updateLazy(): void {
    if (this.updateTimerSubscription){
      this.updateTimerSubscription.unsubscribe();
    }

    this.updateTimerSubscription = timer(1000).pipe(take(1)).subscribe(() => {
      this.update();
    });
  }


  public load(): void {
    this.dataService.getSpace(this.groupId, this.roomId, this.spaceKey).subscribe((space) => {
      if (space.updatedAt === this.space?.updatedAt) {
        return;
      }

      // this.isEditMode = space.isEditMode;
      this.space = space;
      this.title = space.title;
      this.content = space.content;
      this.titleElement.nativeElement.innerText = space.title;
      this.contentElement.nativeElement.innerText = space.content;
     });
  }

}
