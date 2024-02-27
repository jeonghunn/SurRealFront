import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DateTime } from 'luxon';
import { ViewerService } from 'src/app/core/viewer.service';
import {
  Attach,
  AttachType,
  ChatCategory,
} from 'src/app/model/type';
import {
  CdkContextMenuTrigger,
  CdkMenuItem,
  CdkMenu,
} from '@angular/cdk/menu';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: [ './message.component.scss' ],
})
export class MessageComponent {

  @Input()
  public category: ChatCategory = ChatCategory.MESSAGE;

  @Input()
  public id: number;

  @Input()
  public user_id: number;

  @Input()
  public color: string = '#46a35e';

  @Input()
  public isHideProfile: boolean = false;

  @Input()
  public name: string;

  @Input()
  public message: string;

  @Input()
  public date: string;

  @Input()
  public meta: any = {};

  @Input()
  public isShowTime: boolean;

  @Input()
  public isAllowControl: boolean = false;

  @Input()
  public attaches: Attach[] = [];

  @Output()
  public reply: EventEmitter<null> = new EventEmitter<null>();
  
  @Output()
  public update: EventEmitter<null> = new EventEmitter<null>();


  public isFocused: boolean = false;

  public withEmojis: RegExp = /\p{Extended_Pictographic}/u
  public readonly chatCategory: typeof ChatCategory = ChatCategory;

  public constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private viewerService: ViewerService,
  ) {
  }

  public get getFormattedDate(): string {
    return DateTime.fromISO(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  }

  public get fontSize(): string {
    return this.withEmojis.test(this.message) && this.message?.length < 10 ? '3rem' : null;
  }

  public onProfileClick(): void {
    this.router.navigateByUrl(`/user/${this.user_id}`);
  }

  public getSrcText(attach: Attach) {
    if(attach.type === AttachType.IMAGE) {
      return this.sanitizer.sanitize(SecurityContext.URL, `${attach.url}?width=160&height=160`);
    }

     return attach.extension?.toUpperCase();
  }

  public onThumbnailClick(index: number, event: MouseEvent): void {
    event.stopPropagation();

    this.viewerService.open(this.attaches, index);
    this.changeDetectorRef.markForCheck();
  }


  public onReplyClick(): void {
    this.reply.emit();
  }

}
