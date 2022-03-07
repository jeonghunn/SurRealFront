import {
  Component,
  Input,
} from '@angular/core';
import { Room } from 'src/app/model/type';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: [ './detail-view.component.scss' ],
})
export class DetailViewComponent {

  @Input()
  public room: Room;

}
