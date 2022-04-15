import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Room } from 'src/app/model/type';

@Component({
  selector: 'app-room-info',
  templateUrl: './group-info.component.html',
  styleUrls: [ './group-info.component.scss' ],
})
export class GroupInfoComponent implements OnInit {

  @Input()
  public room: Room;

  public constructor() { }

  public ngOnInit(): void {
  }

}
