import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { DateTime } from 'luxon';

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

  public get getFormattedDate(): string {
    return DateTime.fromISO(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  }
}
