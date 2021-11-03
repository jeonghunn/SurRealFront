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

  public isLoading: boolean = true;
  public offset: number = 0;
  public isFullyLoad: boolean = false;

  public constructor(
    private dataService: DataService,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  public init(): void {
    this.fetch(this.offset);
  }

  public fetch(offset: number): void {
    this.isLoading = true;
    this.dataService.getRooms(this.groupId, offset).pipe(take(1)).subscribe((rooms) => {
      this.rooms = this.rooms.concat(rooms);
      console.log(this.rooms.length);
      this.isLoading = false;
      this.isFullyLoad = rooms.length === 0;
    });
  }

  public onScroll(event: any): void {
    if (
      !this.isLoading &&
      !this.isFullyLoad &&
      event.target.scrollHeight - 200 < event.target.scrollTop + event.target.offsetHeight
    ) {
      this.offset += 15;
      this.fetch(this.offset);
    }
  }

  public getDescription(): string {
    return '설명';
  }

}
