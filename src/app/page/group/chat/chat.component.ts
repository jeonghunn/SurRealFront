import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
export class ChatComponent implements OnDestroy, AfterViewChecked {

  @Input()
  public room: Room;

  @Input()
  public chats: Chat[];

  @Input()
  public isDisabled: boolean = false;

  public readonly DEFAULT_FOOTER_WIDTH: number = 400;
  public readonly CHAT_AUTO_SCROLL_ALLOW_THRESHOLD: number = 16;

  public isShortWidth: boolean = false;
  public message: string;
  public isAutoScroll: boolean = true;
  public isManualScroll: boolean = true;
  public lastChatLength: number = 0;

  @Output()
  public readonly chatSend: EventEmitter<Chat> = new EventEmitter();

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

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public getDate(): Date {
    return DateTime.now();
  }

  public ngAfterViewChecked(): void {
    if (this.lastChatLength !== this.chats?.length && this.isAutoScroll) {
      this.lastChatLength = this.chats?.length;
      this.scrollToBottom(true);
    }

  }

  public onScroll(event: any): void {
    if (!this.isManualScroll) {
      return;
    }

    this.isAutoScroll = event?.target?.scrollTop >
      event?.target?.scrollHeight - event?.target?.offsetHeight - this.CHAT_AUTO_SCROLL_ALLOW_THRESHOLD;
  }

  public scrollToBottom(isNotForced: boolean = false): void {
    if (this.chatContainer.nativeElement && (!isNotForced || this.isAutoScroll)) {
      this.isManualScroll = false;
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight - this.chatContainer.nativeElement.offsetHeight;
    }
  }

  public sendMessage(text: string): void {
    if (text?.length === 0) {
      return;
    }

    this.isAutoScroll = true;
    this.message = '';
    this.chatSend.emit(new Chat(null, text, null, null));
    this.message = '';

  }

}
