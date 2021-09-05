import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
} from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Group,
  User,
} from 'src/app/model/type';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  public groups$: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>(undefined);

  public constructor(
    public dataService: DataService,
  ) { }

  public fetchGroupList(): void {
    this.dataService.getGroupList().pipe(take(1)).subscribe((groups: Group[]) => {
      this.groups$.next(groups);
    });
  }

}
