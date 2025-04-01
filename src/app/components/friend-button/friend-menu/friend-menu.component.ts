import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/type';

@Component({
    selector: 'app-friend-menu',
    templateUrl: './friend-menu.component.html',
    styleUrls: ['./friend-menu.component.scss'],
    standalone: true,
    imports: [
      MatMenuModule,
      TranslateModule,
    ],
})
export class FriendMenuComponent {

  @Output()
  public readonly deleteFriend: EventEmitter<null> = new EventEmitter<null>();

  @Input()
  public user: User;

}
