import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import {
  webSocket,
  WebSocketSubject,
} from 'rxjs/webSocket';
import { LayoutService } from 'src/app/core/layout.service';
import { Util } from 'src/app/core/util';
import { Chat } from 'src/app/model/type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [ './chat.component.scss' ],
})
export class ChatComponent implements OnDestroy {

  public DEFAULT_FOOTER_WIDTH: number = 400;

  public isShortWidth: boolean = false;

  public chats: Chat[] = [];
  public message: string;
  public webSocketSubject: WebSocketSubject<any> = null;

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private layoutService: LayoutService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.webSocketSubject = webSocket(environment.socketServerUrl);

    this.subscriptions = [
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
      this.layoutService.isSideNavOpen$.subscribe(isOpen => {
        this.changeDetectorRef.markForCheck();
      }),
      this.webSocketSubject.subscribe(
        (msg) => {
          console.log( msg);
          this.chats.push(msg as Chat);
        },
        err => console.log(err),
        () => console.log('complete'),
      ),
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
    this.message = '';
    this.webSocketSubject.next({ content: text });
  }

}
