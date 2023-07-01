import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
} from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Group,
  Room,
} from 'src/app/model/type';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  public groups$: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>(undefined);
  public openedGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(undefined);
  public openedRoom$: BehaviorSubject<Room> = new BehaviorSubject<Room>(undefined);

  public constructor(
    public dataService: DataService,
  ) { }

  public fetchGroupList(): void {
    this.dataService.getGroupList().pipe(take(1)).subscribe((groups: Group[]) => {
      this.groups$.next(groups);
    });
  }

  public open(id: number, roomId: number = null): void {
    this.dataService.getGroup(id).pipe(take(1)).subscribe((group: Group) => {
      const defaultRoomId: number = parseInt(localStorage.getItem(`group_${id}_room_id`), 10);
      this.openedGroup$.next(group);
      this.openRoom(id, roomId || defaultRoomId);
    });
  }

  public openRoom(groupId: number, id: number | null): void {
    if (!groupId || !id) {
      this.openedRoom$.next(null);
    }

    this.dataService.getRoom(groupId, id).pipe(take(1)).subscribe((room: Room) => {
      this.openedRoom$.next(room);

      if (room) {
        localStorage.setItem(`group_${room.group_id}_room_id`, room.id.toString());
      }

    });
  }

  public getLastOpenedRoom(groupId: number): number {
    return parseInt(localStorage.getItem(`group_${groupId}_room_id`), 10);
  }

}
