import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { Room } from 'src/app/model/type';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: [ './room-list.component.scss' ],
})
export class RoomListComponent implements OnChanges {

  @Input()
  public groupId: number;

  public rooms: Room[] = [];

  public constructor(
    private dataService: DataService,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  public init(): void {

    this.dataService.getRooms(this.groupId).pipe(take(1)).subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

}
