import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { GroupService } from 'src/app/core/group.service';
import { Util } from 'src/app/core/util';
import { Room } from 'src/app/model/type';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: [ './room-list.component.scss' ],
})
export class RoomListComponent implements OnChanges, OnDestroy {

  @Input()
  public groupId: number;

  @Output()
  public readonly select: EventEmitter<Room> = new EventEmitter();

  public rooms: Room[] = [];

  public isLoading: boolean = true;
  public offset: number = 0;
  public isFullyLoad: boolean = false;
  public selectedRoomId: number = 0;

  private subscriptions: Subscription[] = [];

  public constructor(
    private dataService: DataService,
    private groupService: GroupService,
  ) {
    this.subscriptions = [
      this.groupService.openedRoom$.subscribe((room: Room) => {
        this.selectedRoomId = room?.id;
      }),
    ];
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  public init(): void {
    this.rooms = [];
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
    const scrollTop: number = parseInt(event.target.scrollTop);
    const offsetHeight: number = parseInt(event.target.offsetHeight);
    if (
      !this.isLoading &&
      !this.isFullyLoad &&
      event.target.scrollHeight - 200 < scrollTop + offsetHeight
    ) {
      this.offset += 15;
      this.fetch(this.offset);
    }
  }

  public getDescription(): string {
    return '설명';
  }

  public onClick(room: Room): void {
    this.select.emit(room);
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

}
