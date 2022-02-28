import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/core/layout.service';
import { Util } from 'src/app/core/util';
import {
  Chat,
  CommunicationType,
} from 'src/app/model/type';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [ './chat.component.scss' ],
})
export class ChatComponent implements OnDestroy {

  @Input()
  public chats: Chat[];

  @Input()
  public isDisabled: boolean = false;

  public DEFAULT_FOOTER_WIDTH: number = 400;

  public isShortWidth: boolean = false;
  public message: string;

  @Output()
  public readonly chatSend: EventEmitter<Chat> = new EventEmitter();

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

  public sendMessage(text: string): void {
    if (text?.length === 0) {
      return;
    }

    this.message = '';
    this.chatSend.emit({
      T: CommunicationType.CHAT,
      user: {
        id: 1,
        name: 'Junghoon',
      },
      content: text,
    });
    this.message = '';

  }

}
