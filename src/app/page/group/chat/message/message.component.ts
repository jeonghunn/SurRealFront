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
import { DataService } from 'src/app/core/data.service';
import { take } from 'rxjs/operators';
import palette from 'src/app/palette';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    standalone: false
})
export class MessageComponent {

  @Input()
  public category: ChatCategory = ChatCategory.MESSAGE;

  @Input()
  public id: string;

  @Input()
  public user_id: number;

  @Input()
  public color: string = '#46a35e';

  @Input()
  public isHideProfile: boolean = false;

  @Input()
  public isSending: boolean = false;

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
  public isNewDay: boolean = false;

  @Input()
  public attaches: Attach[] = [];

  @Output()
  public reply: EventEmitter<null> = new EventEmitter<null>();
  
  @Output()
  public update: EventEmitter<null> = new EventEmitter<null>();


  public isFocused: boolean = false;
  public isRefreshRequested: boolean = false;

  public withEmojis: RegExp = /\p{Extended_Pictographic}/u
  public readonly chatCategory: typeof ChatCategory = ChatCategory;

  public constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private viewerService: ViewerService,
    private dataService: DataService,
  ) {
  }

  public get getFormattedDate(): string {
    return DateTime.fromISO(this.date).toLocaleString(DateTime.DATE_FULL);
  }

  public get getFormattedDateTime(): string {
    return DateTime.fromISO(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  }

  public get fontSize(): string {
    return this.withEmojis.test(this.message) && this.message?.length < 10 ? '3rem' : null;
  }

  public get textStyle(): any {
    return {
      color: this.isSending ? palette.SKELETON_LOADER : null,
      fontSize: this.fontSize,
    };
  }

  public onProfileClick(): void {
    this.router.navigateByUrl(`/user/${this.user_id}`);
  }

  public getSrcText(attach: Attach) {
    const thumbnailUrl = attach.urls?.thumbnail;
   if (attach.type === AttachType.IMAGE) {

      if (!thumbnailUrl && !this.isRefreshRequested) {
        this.requestRefresh();
      }

      return this.sanitizer.sanitize(SecurityContext.URL, thumbnailUrl);
    }

     return attach.extension?.toUpperCase();
  }

  public requestRefresh(): void {
    this.dataService.refreshChat(this.id).pipe(take(1)).subscribe();
    this.isRefreshRequested = true;
  }
    

  public onThumbnailClick(index: number, event: MouseEvent): void {
    event.stopPropagation();

    this.viewerService.open(this.attaches, index, this.id);
    this.changeDetectorRef.markForCheck();
  }


  public onReplyClick(): void {
    this.reply.emit();
  }

}
