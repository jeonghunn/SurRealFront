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
  public openedRoom$: BehaviorSubject<Room> = new BehaviorSubject<Room>(undefined);

  public constructor(
    public dataService: DataService,
  ) { }

  public fetchGroupList(): void {
    this.dataService.getGroupList().pipe(take(1)).subscribe((groups: Group[]) => {
      this.groups$.next(groups);
    });
  }

}
