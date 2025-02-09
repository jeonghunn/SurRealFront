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
    styleUrls: ['./chat.component.scss'],
    standalone: false
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
  public sendingChats: Chat[];

  @Input()
  public isDisabled: boolean = false;

  @Input()
  public isLoading: boolean = false;

  @Input()
  public isChatLoading: boolean = true;

  @Input()
  public isFullyLoad: boolean = false;


  public readonly DEFAULT_FOOTER_WIDTH: number = 400;
  public readonly CHAT_AUTO_SCROLL_ALLOW_THRESHOLD: number = 16;
  public readonly CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD: number = 210;

  public isShortWidth: boolean = false;
  public message: string;
  public isAutoScrollActive: boolean = true;
  public isInteracting: boolean = false;
  public isTouching: boolean = false;
  public lastChatScrollDeltaY: number = 0;
  public uploadingFiles: number = 0;
  public chatErrorMessage: string = null;
  public attachDeleteDialogRef: MatDialogRef<ConfirmComponent>;
  public chatContainerHeight: string = null;
  public chatContainerScrollHeight: number = 0;
  public lastScrollTop: number = 0;
  public isScrollTopNeedToBeSet: boolean = false;

  public isMultiLineEnabled: boolean = false;
  public isHeaderVisible: boolean = true;

  public isHeaderUpdated: boolean = false;

  public replyChat: Chat = null;
  public focusedMessageChat: Chat = null;

  public footerBottom: number | string = 0;

  public files: FileContainer[] = [];

  @Output()
  public readonly chatSend: EventEmitter<Chat> = new EventEmitter();

  @Output()
  public readonly loadPreviousChats: EventEmitter<null> = new EventEmitter<null>();

  public readonly DEFAULT_FOOTER_HEIGHT: number = 48;
  public readonly CHAT_LOADING_PROGRESS_BAR_HEIGHT: number = 210;
  public readonly CHAT_INPUT_FIELD_TOP_MARGIN: number = 8;

  @ViewChild('chatContainer')
  private chatContainer: ElementRef;

  @ViewChild('headerContainer')
  private headerContainer: ElementRef;

  @ViewChild('footer')
  private footer: ElementRef;

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
        this.onChatFieldResize();
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

    window.visualViewport.onresize = () => {
      this.onChatFieldFocus();
    }
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

  public get footerStyle(): any {
    return {
      width: this.footerWidth,
      bottom: this.footerBottom,
    };
  }

  public counter(i: number): any[] {
    return new Array(i);
  }

  public onFileButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  public onChatClick(chat: Chat): void {
    this.roomService.clipboardChat$.next(chat);
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
    this.onChatFieldResize();
  }

  public isNewDate(chat: Chat, previousChat: Chat): boolean {
    if (!previousChat) {
      return true;
    }

    const previousDate: Date = DateTime.fromISO(previousChat?.createdAt).toJSDate();
    const currentDate: Date = DateTime.fromISO(chat?.createdAt).toJSDate();

    return previousDate.getDate() !== currentDate.getDate() ||
    previousDate.getMonth() !== currentDate.getMonth() ||
    previousDate.getFullYear() !== currentDate.getFullYear();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    let scrollTop: number = this.chatContainer?.nativeElement?.scrollTop;

    if (changes?.room || changes?.topic) {
      this.init();
      scrollTop = 0;
      this.changeDetectorRef.markForCheck();
    }

    if (changes?.extraChats) {
      this.isHeaderUpdated = true;
    }

  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public getDate(): Date {
    return DateTime.now();
  }

  public init(): void {
    this.isAutoScrollActive = true;
    this.isHeaderUpdated = true;
    this.replyChat = null;
  }


  public getSrcText(file: any) {
    if(file.file?.type.includes('image')) {
      return this.sanitizer.sanitize(SecurityContext.URL, file?.url);
    }

    return file.file?.name.split('.').pop().toUpperCase();
  }

  public ngAfterViewChecked(): void {

    const scrollTop: number = this.chatContainer?.nativeElement?.scrollTop;
    const scrollHeight: number = this.chatContainer?.nativeElement?.scrollHeight;
    const scrollOffset: number = this.chatContainer?.nativeElement?.offsetHeight;

    if (this.isHeaderUpdated) {
      this.onChatFieldResize();
      this.isHeaderUpdated = false;
    }

    if (
      this.isAutoScrollActive &&
      scrollTop < scrollHeight - scrollOffset - this.CHAT_AUTO_SCROLL_ALLOW_THRESHOLD
    ) {
      this.executeAutoScroll();
    }

    if (
      this.chatContainer &&
      this.isScrollTopNeedToBeSet &&
      !this.isChatLoading &&
      scrollTop >= 0 &&
      this.chatContainer.nativeElement.scrollHeight > this.chatContainerScrollHeight + this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD &&
      !this.isTouching
    ) {
      const scrollTopCandidate = this.chatContainer.nativeElement.scrollHeight - this.chatContainerScrollHeight + this.lastScrollTop + this.CHAT_AUTO_SCROLL_ALLOW_THRESHOLD;
      this.chatContainer.nativeElement.scrollTop = scrollTopCandidate;
      this.isScrollTopNeedToBeSet = false;

      return;
    }
    
    if (
      this.chatContainerScrollHeight < this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD &&
      scrollTop < this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD &&
      !this.isFullyLoad) {
      this.emitLoadingPreviousChats();
    }


  }

  public executeAutoScroll(): void {
    this.scrollToBottom(true);
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
        this.deleteAttachByUrl(result?.data);  
      }

      this.attachDeleteDialogRef = null;
    });

  }

  public deleteAttachByUrl(url: string): void {
    this.roomService.deleteAttachByUrl(url);
    this.fileInput.nativeElement.value = null;
  }

  public clearAttaches(): void {
    this.roomService.clearFiles();
    this.fileInput.nativeElement.value = null;
  }


  public onMouseOver() {
  }

  public onMouseDown() {
    this.isAutoScrollActive = false;
    this.isInteracting = true;
  }

  public onMouseWheel(event: any) {
    this.isAutoScrollActive = false;
    this.isInteracting = true;
    this.lastChatScrollDeltaY = event?.deltaY;
  }

  public onTouchStart() {
    this.isAutoScrollActive = false;
    this.isInteracting = true;
    this.isTouching = true;
  }

  public onMouseLeave() {
    this.isInteracting = false;
  }

  public onTouchEnd() {
    this.isInteracting = false;
    this.isTouching = false;
  }

  public emitLoadingPreviousChats(): void {
    this.changeDetectorRef.markForCheck();
    this.chatContainerScrollHeight = this.chatContainer.nativeElement.scrollHeight;
    this.lastScrollTop = this.chatContainer.nativeElement.scrollTop;
    this.loadPreviousChats.emit();
    this.isScrollTopNeedToBeSet = true;
  }

  public onScroll(event: any): void {
    const scrollTop: number = event?.target?.scrollTop;
    const shouldAutoScrollActive: boolean = scrollTop >
      event?.target?.scrollHeight - event?.target?.offsetHeight - this.CHAT_AUTO_SCROLL_ALLOW_THRESHOLD;

    if (
      scrollTop < this.CHAT_PREVIOUS_CHAT_LOAD_THRESHOLD &&
      scrollTop >= -1 &&
      !this.isLoading &&
      !this.isTouching
    ) {
      this.emitLoadingPreviousChats();
    }


    if (!this.isInteracting && this.isAutoScrollActive && !shouldAutoScrollActive) {
      this.executeAutoScroll();
      return;
    }

    this.isAutoScrollActive = shouldAutoScrollActive;

  }

  public scrollToBottom(isNotForced: boolean = false): void {
    if (this.chatContainer.nativeElement && (!isNotForced || this.isAutoScrollActive)) {
      this.isAutoScrollActive = true;
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight - this.chatContainer.nativeElement.offsetHeight;
      this.changeDetectorRef.markForCheck();
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

  public onSendKeyDown(event: any): void {
    if (event?.isComposing === true) {
      return;
    }

    if (event?.key === 'Enter' && !this.isMultiLineEnabled) {
      event.preventDefault();
    }

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

  public onSendButtonClicked(text: string): void {
    this.onSendExecute(text);
  }

  public initMultiLineSetting(): void {
    this.isMultiLineEnabled = false;
  }

  public onSendExecute(text: string): void {
    this.chatErrorMessage = null;
    this.initMultiLineSetting();
    this.scrollToBottom();

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
            this.clearAttaches();
          }
        });
      });

      return;
    }

    this.sendMessage(text);
  }

  public onChatFieldFocus(): void {
    this.footerBottom = '100%';
    this.changeDetectorRef.markForCheck();
    setTimeout(() => {
      this.footerBottom = 0;
      this.onChatFieldResize();

      this.changeDetectorRef.markForCheck();
    }, 1);

  }

  public sendMessage(
    text: string,
    meta: any = {},
    ): void {
    this.isAutoScrollActive = true;
    this.message = '';

    if (this.replyChat) {
      this.isChatLoading = true;
      this.dataService.createTopicByChat(
        this.room?.group_id,
        this.room?.id,
        this.replyChat?.id,
        `${this.replyChat?.user?.name}: ${this.replyChat?.content}`,
      ).pipe(
        take(1),
        catchError((err: any) => {
          this.isChatLoading = false;
          console.log('[ERROR] Create Topic by Chat : ', err);
          return of(err);
        }),
      ).subscribe((result: any) => {
        this.isChatLoading = false;
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

  public onChatFieldResize() {
    const footerHeight: number = this.footer?.nativeElement?.offsetHeight || 0;
    const headerHeight: number = this.headerContainer?.nativeElement?.offsetHeight || 0;
    const unavailableHeight: number = window.innerHeight - window.visualViewport?.height;
    const delta: number = footerHeight + headerHeight + unavailableHeight + this.CHAT_INPUT_FIELD_TOP_MARGIN;

    this.chatContainerHeight = `calc(100% - ${delta}px)`;
    this.footerBottom = Math.round(window.innerHeight - window.visualViewport?.height) + 'px';
    this.changeDetectorRef.markForCheck();

  }

  public onOtherChatClick(chat: Chat): void {
   this.goToTopic(chat?.topic_id);
  }
    


}
