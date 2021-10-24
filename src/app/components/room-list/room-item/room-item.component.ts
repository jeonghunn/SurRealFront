import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: [ './room-item.component.scss' ],
})
export class RoomItemComponent {

  @Input()
  public name: string;

  @Input()
  public description: string;

}
