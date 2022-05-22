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
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/core/layout.service';
import { Util } from 'src/app/core/util';
import {
  Chat,
  Room,
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
  public chats: Chat[];

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

  @Output()
  public readonly chatSend: EventEmitter<Chat> = new EventEmitter();

  @Output()
  public readonly loadPreviousChats: EventEmitter<null> = new EventEmitter<null>();

  @ViewChild('chatContainer')
  private chatContainer: ElementRef;

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private layoutService: LayoutService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

    this.subscriptions = [
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
      this.layoutService.isSideNavOpen$.subscribe(isOpen => {
        this.changeDetectorRef.markForCheck();
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

  public ngOnChanges(changes: SimpleChanges): void {
    let scrollTop: number = this.chatContainer?.nativeElement?.scrollTop;

    if (changes?.room) {
      this.isManualScroll = true;
      this.isAutoScrollActive = true;
      this.lastChatLength = 0;
      scrollTop = 0;
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

  public ngAfterViewChecked(): void {
    if (this.lastChatLength !== this.chats?.length && this.isAutoScrollActive) {
      this.lastChatLength = this.chats?.length;
      this.scrollToBottom(true);
    }

  }

  public onScroll(event: any): void {
    const scrollTop: number = event?.target?.scrollTop;
    const shouldAutoScrollActive: boolean = scrollTop >
      event?.target?.scrollHeight - event?.target?.offsetHeight - this.CHAT_AUTO_SCROLL_ALLOW_THRESHOLD;
    console.log(this.isManualScroll);
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

  public sendMessage(text: string): void {
    if (!text || text?.length === 0) {
      return;
    }

    this.isAutoScrollActive = true;
    this.message = '';
    this.chatSend.emit(new Chat(null, text, null, null));
    this.message = '';

  }

}
