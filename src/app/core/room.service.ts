import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../model/type';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  public liveRoomContent$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  public setLiveRoomContent(data: any): void {
    this.liveRoomContent$.next(data);
  }
}
