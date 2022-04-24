import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { RoomCreateComponent } from 'src/app/components/room/room-create/room-create.component';
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

  @Input()
  public isRoomActive: boolean = true;

  @Output()
  public readonly itemSelect: EventEmitter<Room> = new EventEmitter();

  public rooms: Room[] = [];

  public isLoading: boolean = true;
  public offset: number = 0;
  public isFullyLoad: boolean = false;
  public selectedRoomId: number = 0;
  public roomCreateDialogRef: MatDialogRef<RoomCreateComponent>;

  private subscriptions: Subscription[] = [];

  public constructor(
    private dataService: DataService,
    private groupService: GroupService,
    private changeDetectorRef: ChangeDetectorRef,
    public matDialog: MatDialog,
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
    this.offset = 0;
    this.fetch(this.offset);
  }

  public fetch(offset: number): void {
    this.isLoading = true;
    this.dataService.getRooms(this.groupId, offset).pipe(take(1)).subscribe((rooms) => {
      this.rooms = offset === 0 ? rooms : this.rooms.concat(rooms);
      this.isLoading = false;
      this.isFullyLoad = rooms.length === 0;
      this.changeDetectorRef.markForCheck();
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

  public openDialog(): void {
    this.roomCreateDialogRef = this.matDialog.open(RoomCreateComponent, {
      maxWidth: '400px',
      minWidth: '280px',
      data: {
        groupId: this.groupId,
      },
    });

    this.roomCreateDialogRef.afterClosed().pipe(take(1)).subscribe(() => {
      this.init();
    });
  }

  public onClick(room: Room): void {
    this.itemSelect.emit(room);
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

}
