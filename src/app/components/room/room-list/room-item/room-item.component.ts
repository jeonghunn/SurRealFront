import {
  Component,
  Input,
} from '@angular/core';

@Component({
    selector: 'app-room-item',
    templateUrl: './room-item.component.html',
    styleUrls: ['./room-item.component.scss'],
    standalone: false
})
export class RoomItemComponent {

  @Input()
  public letter: string;

  @Input()
  public name: string;

  @Input()
  public description: string;

  @Input()
  public isSelected: boolean;

}
