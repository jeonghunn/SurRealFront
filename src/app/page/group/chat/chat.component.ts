import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SecurityContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import {
  Subscription,
  catchError,
  of,
  take,
} from 'rxjs';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { DataService } from 'src/app/core/data.service';
import { LayoutService } from 'src/app/core/layout.service';
import { RoomService } from 'src/app/core/room.service';
import { Util } from 'src/app/core/util';
import {
  Chat,
  ChatSpaceCategory,
  FileContainer,
  ChatCategory,
  Room,
  Topic,
} from 'src/app/model/type';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [ './chat.component.scss' ],
})
export class ChatComponent implements OnDestroy, AfterViewChecked, OnChanges {

  @Input()
  public room: Room;

  @Input()
  public topic: Topic;

  @Input()
  public chats: Chat[];

  @Input()
  public extraChats: Chat[];

  @Input()
  public isDisabled: boolean = false;

  @Input()
  public isLoading: boolean = false;

  @Input()
  public isFullyLoad: boolean = false;


  public readonly DEFAULT_FOOTER_WIDTH: number = 400;
  public readonly CHAT_AUTO_SCROLL_ALLOW_THRESHOLD: number = 16;
  public readonly CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD: number = 30;

  public isShortWidth: boolean = false;
  public message: string;
  public isAutoScrollActive: boolean = true;
  public isManualScroll: boolean = true;
  public lastChatLength: number = 0;
  public uploadingFiles: number = 0;
  public chatErrorMessage: string = null;
  public attachDeleteDialogRef: MatDialogRef<ConfirmComponent>;
  public chatContainerHeight: string = null;
  public isMultiLineEnabled: boolean = false;
  public isTouchMode: boolean = false;
  public isHeaderVisible: boolean = true;

  public isHeaderUpdated: boolean = false;

  public replyChat: Chat = null;
  public focusedMessageChat: Chat = null;

  public files: FileContainer[] = [];

  @Output()
  public readonly chatSend: EventEmitter<Chat> = new EventEmitter();

  @Output()
  public readonly loadPreviousChats: EventEmitter<null> = new EventEmitter<null>();

  public readonly DEFAULT_FOOTER_HEIGHT: number = 24;

  @ViewChild('chatContainer')
  private chatContainer: ElementRef;

  @ViewChild('headerContainer')
  private headerContainer: ElementRef;

  @ViewChild('fileInput')
  private fileInput: ElementRef;

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private layoutService: LayoutService,
    private changeDetectorRef: ChangeDetectorRef,
    private roomService: RoomService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private matDialog: MatDialog,
    private translateService: TranslateService,
    private router: Router, 
  ) {

    this.subscriptions = [
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
        this.onChatFieldResize(this.DEFAULT_FOOTER_HEIGHT);
      }),
      this.layoutService.isSideNavOpen$.subscribe(isOpen => {
        this.changeDetectorRef.markForCheck();
      }),
      this.roomService.uploadFiles$.subscribe((files: FileContainer[]) => {
        this.files = files;
        this.changeDetectorRef.markForCheck();
      }),
      this.roomService.lastOtherChat$.subscribe((chat: Chat) => {
        this.isHeaderUpdated = true;
      }),
    ];
  }

  public get isSideNavOpen(): boolean {
    return this.layoutService.isSideNavOpen;
  }

  public get footerWidth(): string {
    if (this.isShortWidth) {
      return this.isSideNavOpen ? null : `calc(100% - 16px)`;
    }

    return `${ this.DEFAULT_FOOTER_WIDTH }px`;
  }

  public counter(i: number): any[] {
    return new Array(i);
  }

  public onFileButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  public goToParentTopic(): void {
    let url: string = `/group/${this.room?.group_id}/room/${this.room?.id}`;

    if (this.topic?.parent_id) {
      url += `/topic/${this.topic?.parent_id}`;
    }

    this.router.navigateByUrl(url).then(null);
  }

  public goToTopic(id: number): void {
    let url: string = `/group/${this.room?.group_id}/room/${this.room?.id}`;

    if (id) {
      url += `/topic/${id}`;
    }

    this.router.navigateByUrl(url).then(null);
  }

  public isHideName(chat: Chat, index: number): boolean {
    return index !== 0 &&
    chat.user?.id === this.chats[index - 1]?.user?.id &&
    chat.content?.length > 0;
  }

  public onFileSelected(event: any): void {
    const files: FileContainer[] = Array.from(event.target?.files).map((x: any) => {
      return {
        file: x,
        url: window.URL.createObjectURL(x),
      };
    });
   

    this.roomService.addFiles(files);
  }

  public onHeaderResize(height: number): void {
    this.onChatFieldResize(this.DEFAULT_FOOTER_HEIGHT);
  }


  public ngOnChanges(changes: SimpleChanges): void {
    let scrollTop: number = this.chatContainer?.nativeElement?.scrollTop;

    if (changes?.room || changes?.topic) {
      this.isManualScroll = true;
      this.isAutoScrollActive = true;
      this.lastChatLength = 0;
      scrollTop = 0;
      this.isHeaderUpdated = true;
      this.changeDetectorRef.markForCheck();
    }

    if (changes?.extraChats) {
      this.isHeaderUpdated = true;
    }

    if (
      changes?.chats &&
      scrollTop < this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD &&
      !this.isFullyLoad
    ) {

      if (scrollTop === 0) {
        this.loadPreviousChats.emit();
      }

      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD + 10;
      }

    }

  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public getDate(): Date {
    return DateTime.now();
  }


  public getSrcText(file: any) {
    if(file.file?.type.includes('image')) {
      return this.sanitizer.sanitize(SecurityContext.URL, file.url);
    }

    return file.file?.name.split('.').pop().toUpperCase();
  }

  public ngAfterViewChecked(): void {

    if (this.isHeaderUpdated) {
      this.onChatFieldResize(this.DEFAULT_FOOTER_HEIGHT);
      this.isHeaderUpdated = false;
      console.log('after view checked header updated');
    }

    if (this.lastChatLength !== this.chats?.length && this.isAutoScrollActive) {
      this.lastChatLength = this.chats?.length;
      this.scrollToBottom(true);
    }

  }

  public openAttachDeleteDialog(file: any): void {
    this.attachDeleteDialogRef = this.matDialog.open(ConfirmComponent, {
      maxWidth: '600px',
      minWidth: '280px',
      data: {
        title: file.file.name,
        src: this.getSrcText(file),
        message: this.translateService.instant('ATTACH.DELETE.DESCRIPTION'),
        positiveText: this.translateService.instant('ATTACH.DELETE.YES'),
        negativeText: this.translateService.instant('ATTACH.DELETE.CANCEL'),
        returnValue: file.url,
      },
      maxHeight: '90vh',
    });

    this.attachDeleteDialogRef.afterClosed().subscribe((result: any) => {
      if (result?.option) {
        this.roomService.deleteAttachByUrl(result?.data);
      }

      this.attachDeleteDialogRef = null;
    });

  }

  public onScroll(event: any): void {
    const scrollTop: number = event?.target?.scrollTop;
    const shouldAutoScrollActive: boolean = scrollTop >
      event?.target?.scrollHeight - event?.target?.offsetHeight - this.CHAT_AUTO_SCROLL_ALLOW_THRESHOLD;

    if (!this.isManualScroll) {
      if (shouldAutoScrollActive) {
        this.isManualScroll = true;
      }
      return;
    }

    if (scrollTop < this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD) {
      this.loadPreviousChats.emit();
    }

    this.isAutoScrollActive = shouldAutoScrollActive;
  }

  public scrollToBottom(isNotForced: boolean = false): void {
    if (this.chatContainer.nativeElement && (!isNotForced || this.isAutoScrollActive)) {
      this.isManualScroll = false;
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight - this.chatContainer.nativeElement.offsetHeight;
    }
  }

  public makeNewLine(event: any): void {
    if (event?.isComposing === true) {
      return;
    }

    this.message += '\n';
    this.isMultiLineEnabled = true;
    event.target.setSelectionRange(this.message.length, this.message.length);
    this.changeDetectorRef.markForCheck();
  }

  public onSendKeyPress(event: any, text: string): void {
    if (this.isMultiLineEnabled || event?.isComposing === true) {
      return; 
    }

    if (text === '\n') {
      this.message = '';
      return;
    }

    this.onSendExecute(text);
  }

  public initMultiLineSetting(): void {
    this.isMultiLineEnabled = false;
  }

  public onSendExecute(text: string): void {
    this.chatErrorMessage = null;
    this.initMultiLineSetting();

    if ((!text || text?.length === 0) && this.files?.length === 0) {
      return;
    }

    if(this.files?.length > 0) {
      const attaches: any[] = [];

      this.files.forEach(file => {
        this.uploadingFiles++;
        this.dataService.postAttach(this.room?.id, file?.file).pipe(
          take(1),
          catchError((err: any) => {
            this.uploadingFiles = 0;
            console.log('[ERROR] File Upload : ', err);

            switch (err?.status) {
              case 413:
                this.chatErrorMessage = 'HTTP_ERROR.413_PAYLOAD_TOO_LARGE.DESCRIPTION';
                break;
              default:
                this.chatErrorMessage = 'ERROR.UNKNOWN';
                break;
            }

            this.changeDetectorRef.markForCheck();

            return of(err);
          }),
        ).subscribe((res: any) => {
          attaches.push({
            binary_name: res?.binary_name,
            type: res?.type,
            name: res?.name,
            extension: res?.extension,
            mimetype: res?.mimetype,
            size: res?.size,
          });

          this.uploadingFiles--;

          if (this.uploadingFiles === 0) {
            this.sendMessage(
              text,
              {
                attaches,
              }
              );
            this.roomService.clearFiles();
          }
        });
      });

      return;
    }

    this.sendMessage(text);
  }

  public sendMessage(
    text: string,
    meta: any = {},
    ): void {
    this.isAutoScrollActive = true;
    this.message = '';

    if (this.replyChat) {
      this.dataService.createTopicByChat(
        this.room?.group_id,
        this.room?.id,
        this.replyChat?.id,
        `${this.replyChat?.user?.name}: ${this.replyChat?.content}`,
      ).pipe(take(1)).subscribe((result: any) => {
        this.replyChat = null;
        meta.topic_id = result?.id;
        this.emitChatSend(text, result?.id, meta);
      });

      return;
    }

    this.emitChatSend(text, this.topic?.id, meta);
    
    this.message = '';

  }

  public emitChatSend(
    text: string,
    topicId: number = null,
    meta: any = null,
    ): void {
    this.chatSend.emit(new Chat(
      null,
      ChatCategory.MESSAGE,
      text,
      null,
      null,
      topicId,
      meta,
      ));
  }

  public onChatFieldResize(height: number) {
    const margin: number = this.isShortWidth ? 24 : -24;
    const headerHeight: number = this.headerContainer?.nativeElement?.offsetHeight;
    const delta: number = (height > 200 ? 200 : height) + margin + headerHeight;

    
    this.chatContainerHeight = `calc(100% - ${ delta }px)`;
    this.changeDetectorRef.markForCheck();

  }

  public onOtherChatClick(chat: Chat): void {
   this.goToTopic(chat?.topic_id);
  }
    


}
