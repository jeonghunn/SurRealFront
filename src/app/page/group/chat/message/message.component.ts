import {
  Component,
  Input,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DateTime } from 'luxon';
import { Attach } from 'src/app/model/type';

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
  ) {
  }

  public get getFormattedDate(): string {
    return DateTime.fromISO(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  }

  public onProfileClick(): void {
    this.router.navigateByUrl(`/user/${this.user_id}`);
  }

  public getSrcText(file: any) {
     return this.sanitizer.sanitize(SecurityContext.URL, `${file.url}?width=160&height=160`);
  }
}
