import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Room } from 'src/app/model/type';

@Component({
    selector: 'app-room-info',
    templateUrl: './group-info.component.html',
    styleUrls: ['./group-info.component.scss'],
    standalone: false
})
export class GroupInfoComponent {

  @Input()
  public room: Room;

}
