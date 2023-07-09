import {
  ChangeDetectorRef,
  Component,
  Input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DateTime } from 'luxon';
import { ViewerService } from 'src/app/core/viewer.service';
import {
  Attach,
  AttachType,
} from 'src/app/model/type';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: [ './message.component.scss' ],
})
export class MessageComponent {

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
  public isShowTime: boolean;

  @Input()
  public attaches: Attach[] = [];

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

  public onProfileClick(): void {
    this.router.navigateByUrl(`/user/${this.user_id}`);
  }

  public getSrcText(attach: Attach) {
    if(attach.type === AttachType.IMAGE) {
      return this.sanitizer.sanitize(SecurityContext.URL, `${attach.url}?width=160&height=160`);
    }

     return attach.extension?.toUpperCase();
  }

  public onThumbnailClick(file: Attach): void {
    this.viewerService.open(file);

    this.changeDetectorRef.markForCheck();
  }

}
